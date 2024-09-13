import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './score-form.ts';
import { getFileNameV1, pbkdf2 } from './utils.ts';
import { ScoreFormSubmitEvent } from './score-form.ts';
import { ScoreStats, UserScore } from './schema.ts';
import './score-loading-scrim.ts';
import './score-error.ts';
import './score-result.ts';
import { until } from 'lit/directives/until.js';
import { repeat } from 'lit/directives/repeat.js';
import { localized, msg, str } from '@lit/localize';

interface OpenWindow {
	fileId: string;
	username: string;
	data: Promise<UserScore>;
	stats: Promise<ScoreStats>;
}

@customElement('whs-score')
@localized()
export class WhsScore extends LitElement {
	@property()
	apiBase: string = 'data';

	@property()
	usernameInputMode: string = 'numeric';
	@property()
	passwordInputMode: string = 'numeric';

	@state()
	isSha1Supported = typeof window.crypto?.subtle?.decrypt === 'function';

	@state()
	isPbkdf2Supported =
		typeof window.crypto?.subtle?.deriveBits === 'function' &&
		typeof window.crypto?.subtle?.importKey === 'function';

	@state()
	openScoreWindows: OpenWindow[] = [];

	private fileList: Promise<FileList> | undefined;

	constructor() {
		super();

		if (this.isSha1Supported) {
			window.crypto.subtle
				.digest('SHA-1', new Uint8Array())
				.catch(() => (this.isSha1Supported = false));
		}

		if (this.isPbkdf2Supported) {
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
			${until(
				Promise.allSettled(this.openScoreWindows).then(() => null),
				html`<score-loading-scrim>${msg('Loading...')}</score-loading-scrim>`
			)}
			<div class="window-container">
				<score-form
					usernameinputmode="${this.usernameInputMode}"
					passwordinputmode="${this.passwordInputMode}"
					@submit=${this.onSubmit}
					.fileList=${this.fileList}
				>
					<div slot="header">
						<slot name="header"></slot>
						${this.isBrowserSupported()
							? null
							: html`<score-error
									>${msg(
										'This browser is not supported. Use Firefox 130 or later'
									)}</score-error
								>`}
						${this.openScoreWindows.length > 0
							? until(
									this.openScoreWindows[
										this.openScoreWindows.length - 1
									].data.then(
										() => null,
										(e: Error) => html`<score-error>${e.message}</score-error>`
									)
								)
							: null}
					</div>
					<slot name="username" slot="username">${msg('Student ID')}</slot>
					<slot name="password" slot="password">${msg('Password')}</slot>
					<slot name="beforefilelist" slot="beforefilelist"></slot>
					<slot name="beforesubmit" slot="beforesubmit"></slot>
					<slot name="footer" slot="footer"></slot>
				</score-form>
				${repeat(this.openScoreWindows, (wnd) =>
					until(
						wnd.data.then(
							(score) =>
								html`<score-result .data=${score} .stats=${wnd.stats}>
									<div name="beforescore" slot="beforescore">
										<slot name="beforescore"></slot>
										<slot name="beforescore-${wnd.fileId}"></slot>
									</div>
									<div name="afterscore" slot="afterscore">
										<slot name="afterscore"></slot>
										<slot name="afterscore-${wnd.fileId}"></slot>
									</div>
								</score-result>`
						),
						null
					)
				)}
			</div>
		`;
	}

	isBrowserSupported(): boolean {
		return (
			this.isSha1Supported &&
			this.isPbkdf2Supported &&
			typeof TextEncoder === 'function'
		);
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
		this.openScoreWindows.push({
			fileId: e.detail.file,
			username: e.detail.username,
			data: downloadPromise,
			stats: statsPromise,
		});
		this.requestUpdate();
	}

	static styles = css`
		.window-container {
			display: flex;
			margin: 10px 0 0 10px;
			flex-flow: row wrap;
		}

		.window-container > * {
			margin-right: 10px;
			margin-bottom: 10px;
		}

		score-result {
			width: 480px;
		}
	`;
}

declare global {
	interface HTMLElementTagNameMap {
		'whs-score': WhsScore;
	}
}
