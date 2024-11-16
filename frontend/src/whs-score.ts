import { LitElement, html, render, PropertyValues, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { getFileNameV1, pbkdf2 } from './utils.ts';
import { ScoreFormSubmitEvent } from './score-form.ts';
import { ScoreStats, UserScore } from './schema.ts';
import { createRef, ref } from 'lit/directives/ref.js';
import { localized, msg, str } from '@lit/localize';
import './score-form.ts';
import './score-wm.ts';
import './score-loading-scrim.ts';
import './score-error.ts';
import './score-result.ts';
import './score-subject-stats.ts';
import './score-font.ts';
import type { WindowManager, Window } from './score-wm.ts';

const ENABLE_V2 = true;
const ENABLE_PBKDF = false;

@customElement('whs-score')
@localized()
export class WhsScore extends LitElement {
	@property()
	apiBase: string = 'data';

	@property()
	usernameInputMode: string = 'numeric';
	@property()
	passwordInputMode: string = 'numeric';

	@property({ type: Boolean })
	topten: boolean = false;

	wmRef = createRef<WindowManager>();

	@state()
	protected isSha1Supported =
		ENABLE_V2 && typeof window.crypto?.subtle?.decrypt === 'function';

	@state()
	isPbkdf2Supported =
		ENABLE_PBKDF &&
		typeof window.crypto?.subtle?.deriveBits === 'function' &&
		typeof window.crypto?.subtle?.importKey === 'function';

	@state()
	protected isLoading: boolean = false;

	@state()
	protected errorMessage: string | null = null;

	private fileList: Promise<FileList> | undefined;

	constructor() {
		super();

		if (ENABLE_V2 && this.isSha1Supported) {
			window.crypto.subtle
				.digest('SHA-1', new Uint8Array())
				.catch(() => (this.isSha1Supported = false));
		}

		if (ENABLE_PBKDF && this.isPbkdf2Supported) {
			pbkdf2('', '', 1).catch(() => (this.isPbkdf2Supported = false));
		}
	}

	connectedCallback() {
		super.connectedCallback();

		this.fileList = fetch(`${this.apiBase}/files.json`).then((v) =>
			v.json()
		) as Promise<FileList>;
	}

	render() {
		return html`
			<score-font></score-font>
			${this.isLoading
				? html`<score-loading-scrim role="status"
						>${msg('Loading...')}</score-loading-scrim
					>`
				: null}
			<score-wm ${ref(this.wmRef)}>
				<score-window>
					<score-form
						usernameinputmode="${this.usernameInputMode}"
						passwordinputmode="${this.passwordInputMode}"
						@submit=${this.onSubmit}
						.fileList=${this.fileList}
					>
						<slot name="header" slot="header"></slot>
						<div slot="header-in">
							<slot name="header-in" slot="header-in"></slot>
							${this.isBrowserSupported()
								? null
								: html`<score-error role="alert"
										>${msg(
											'This browser is not supported. Use Firefox 130 or later'
										)}</score-error
									>`}
							${this.errorMessage
								? html`<score-error role="alert"
										>${this.errorMessage}</score-error
									>`
								: null}
						</div>
						<slot name="username" slot="username">${msg('Student ID')}</slot>
						<slot name="password" slot="password">${msg('Password')}</slot>
						<slot name="beforefilelist" slot="beforefilelist"></slot>
						<slot name="beforesubmit" slot="beforesubmit"></slot>
						<slot name="footer" slot="footer"></slot>
					</score-form>
				</score-window>
			</score-wm>
		`;
	}

	protected renderScoreWindow(
		fileId: string,
		score: UserScore,
		stats: Promise<ScoreStats>
	) {
		let onClose = () => {
			this.wmRef.value?.pop();
		};
		let onStats = (e: CustomEvent) => {
			stats.then((stats) => {
				this.wmRef.value?.push(this.renderStatsWindow(score, stats, e.detail));
			});
		};

		let fragment = document.createDocumentFragment();
		render(
			html`<score-window>
				<score-result
					.data=${score}
					.stats=${stats}
					@close=${onClose}
					@stats=${onStats}
				>
					<div slot="beforescore">
						<slot name="beforescore"></slot>
						<slot name="beforescore-${fileId}"></slot>
					</div>
					<div slot="afterscore">
						<slot name="afterscore"></slot>
						<slot name="afterscore-${fileId}"></slot>
					</div>
				</score-result>
			</score-window>`,
			fragment
		);
		return fragment.firstElementChild as unknown as Window;
	}

	protected renderStatsWindow(
		score: UserScore,
		stats: ScoreStats,
		subject: string
	) {
		let onClose = () => {
			this.wmRef.value?.pop();
		};
		let fragment = document.createDocumentFragment();
		render(
			html`<score-window>
				<score-subject-stats
					subject="${subject}"
					.score=${score[subject!]}
					.stats=${stats[subject!]}
					@close=${onClose}
					.topten=${this.topten}
				></score-subject-stats>
			</score-window>`,
			fragment
		);
		return fragment.firstElementChild as unknown as Window;
	}

	isBrowserSupported(): boolean {
		return (
			(!ENABLE_V2 || this.isSha1Supported) &&
			(!ENABLE_PBKDF || this.isPbkdf2Supported) &&
			typeof TextEncoder === 'function'
		);
	}
	protected updated(changed: PropertyValues) {
		super.updated(changed);
		if (changed.has('errorMessage') && this.errorMessage) {
			this.scrollIntoView(true);
		}
	}

	private onSubmit(e: CustomEvent<ScoreFormSubmitEvent>) {
		e.preventDefault();
		let downloadPromise = (async () => {
			let filename = await getFileNameV1(
				e.detail.file,
				e.detail.username,
				e.detail.password
			);
			try {
				var resp = await fetch(`${this.apiBase}/${filename}`);
			} catch (e) {
				throw new Error(msg('Unable to retrieve data'));
			}

			if (resp.status === 404) {
				throw new Error(msg('Not found. Check form input'));
			} else if (resp.status !== 200) {
				throw new Error(
					msg(str`Unable to retrieve data (Status code ${resp.status})`)
				);
			}

			return resp.json() as Promise<UserScore>;
		})();
		let statsPromise = (async () => {
			let resp = await fetch(`${this.apiBase}/${e.detail.file}/stats.json`);
			return resp.json() as Promise<ScoreStats>;
		})();

		this.errorMessage = null;
		this.isLoading = true;

		downloadPromise.then(
			(userScore) => {
				this.isLoading = false;
				this.wmRef.value?.push(
					this.renderScoreWindow(e.detail.file, userScore, statsPromise)
				);
			},
			(e: Error) => {
				this.errorMessage = e.toString();
				this.isLoading = false;
			}
		);

		this.requestUpdate();
	}

	static styles = css`
		:host {
			display: block;
			line-height: 1.4;
		}
	`;
}

declare global {
	interface HTMLElementTagNameMap {
		'whs-score': WhsScore;
	}
}
