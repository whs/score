import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './score-form.ts';
import { getFileNameV1, pbkdf2 } from './utils.ts';
import { ScoreFormSubmitEvent } from './score-form.ts';
import { ScoreStats, UserScore } from './schema.ts';
import { until } from 'lit/directives/until.js';
import { localized, msg, str } from '@lit/localize';
import './score-loading-scrim.ts';
import './score-error.ts';
import './score-result.ts';
import './score-subject-stats.ts';

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

	@property({ type: Boolean })
	topten: boolean = false;

	@state()
	isSha1Supported = typeof window.crypto?.subtle?.decrypt === 'function';

	@state()
	isPbkdf2Supported =
		typeof window.crypto?.subtle?.deriveBits === 'function' &&
		typeof window.crypto?.subtle?.importKey === 'function';

	@state()
	openScoreWindow: OpenWindow | null = null;

	@state()
	openStatsWindow: string | null = null;

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
			<div class="window-container">
				<div class="window opaque noanim">
					<div class="window-inner">
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
								${this.openScoreWindow
									? until(
											this.openScoreWindow.data.then(
												() => null,
												(e: Error) =>
													html`<score-error>${e.message}</score-error>`
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
					</div>
				</div>
				${this.openScoreWindow
					? until(
							this.openScoreWindow.data.then(
								(score) => {
									let onClose = () => {
										this.openScoreWindow = null;
									};
									let onStats = (e: CustomEvent) => {
										this.openStatsWindow = e.detail;
									};
									return html`<div class="window opaque">
										<div class="window-inner">
											<score-result
												.data=${score}
												.stats=${this.openScoreWindow!.stats}
												@close=${onClose}
												@stats=${onStats}
											>
												<div name="beforescore" slot="beforescore">
													<slot name="beforescore"></slot>
													<slot
														name="beforescore-${this.openScoreWindow!.fileId}"
													></slot>
												</div>
												<div name="afterscore" slot="afterscore">
													<slot name="afterscore"></slot>
													<slot
														name="afterscore-${this.openScoreWindow!.fileId}"
													></slot>
												</div>
											</score-result>
										</div>
									</div>`;
								},
								() => null
							),
							html`<div class="window translucent">
								<div class="window-inner">
									<score-loading-scrim
										>${msg('Loading...')}</score-loading-scrim
									>
								</div>
							</div>`
						)
					: null}
				${this.openScoreWindow && this.openStatsWindow
					? until(
							Promise.all([
								this.openScoreWindow.data,
								this.openScoreWindow.stats,
							]).then(
								([score, stats]) => {
									let onClose = () => {
										this.openStatsWindow = null;
									};
									return html`<div class="window translucent">
										<div class="window-inner">
											<score-subject-stats
												subject="${this.openStatsWindow!}"
												.score=${score[this.openStatsWindow!]}
												.stats=${stats[this.openStatsWindow!]}
												@close=${onClose}
												.topten=${this.topten}
											></score-subject-stats>
										</div>
									</div>`;
								},
								() => null
							),
							html`<div class="window translucent">
								<div class="window-inner">
									<score-loading-scrim
										>${msg('Loading...')}</score-loading-scrim
									>
								</div>
							</div>`
						)
					: null}
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
		this.openScoreWindow = {
			fileId: e.detail.file,
			username: e.detail.username,
			data: downloadPromise,
			stats: statsPromise,
		};
		this.requestUpdate();
	}

	static styles = css`
		.window-container {
			width: 100%;
			height: 100%;
			background-color: #ecf0f5;
			display: grid;
			box-sizing: border-box;
		}

		.window {
			display: flex;
			width: 100%;
			height: 100%;
			grid-column: 1;
			grid-row: 1;
			justify-content: center;
			padding: 10px 0;
		}

		/* Animations are removed as lit doesn't reuse the dom */

		.window.opaque {
			background-color: #ecf0f5;
			/*animation: slideright ease-out 500ms;*/
		}

		.window.translucent {
			max-width: 100%;
			/*animation: blurbg linear forwards 250ms;*/
			backdrop-filter: blur(48px);
		}

		.window.noanim {
			animation: none;
		}

		.window-inner {
			width: 100%;
			max-width: 720px;
		}

		@keyframes slideright {
			from {
				transform: translateX(100%);
			}

			to {
				transform: translateX(0);
			}
		}

		@keyframes blurbg {
			from {
				backdrop-filter: blur(0px);
				opacity: 0;
			}

			to {
				backdrop-filter: blur(48px);
				opacity: 1;
			}
		}
	`;
}

declare global {
	interface HTMLElementTagNameMap {
		'whs-score': WhsScore;
	}
}
