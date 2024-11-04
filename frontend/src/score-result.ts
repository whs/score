import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { ScoreStats, SubjectScore, UserScore } from './schema.ts';
import { until } from 'lit/directives/until.js';
import { localized, msg } from '@lit/localize';
import './score-subject.ts';
import './score-round-button.ts';
import ibmPlex from '@fontsource/ibm-plex-sans-thai/500.css?inline&lit';
import ibmPlexLooped from '@fontsource/ibm-plex-sans-thai-looped/400.css?inline&lit';
import icLogout from 'remixicon/icons/System/logout-circle-r-line.svg';

@customElement('score-result')
@localized()
export class ScoreResult extends LitElement {
	@property()
	data: UserScore = { _name: '', _fname: '' };
	@property()
	stats: Promise<ScoreStats> | undefined;

	numberFormatter = new Intl.NumberFormat(undefined, {
		maximumFractionDigits: 4,
	});
	percentFormatter = new Intl.NumberFormat(undefined, {
		style: 'percent',
		minimumFractionDigits: 0,
	});

	render() {
		return html`
			<nav>
				<score-round-button
					@click="${() => this.dispatchEvent(new CustomEvent('close'))}"
					><img src="${icLogout}" alt="Logout"
				/></score-round-button>
			</nav>
			<header>
				<div class="greeting">${msg('Hello, 👋')}</div>
				<div class="name">${this.data!._name}</div>
				<div class="filename">${this.data!._fname}</div>
			</header>
			<slot name="beforescore"></slot>
			${repeat(
				Object.keys(this.data!),
				(key) => key,
				(subject) => {
					if (subject.startsWith('_')) {
						return null;
					}

					let score = this.data![subject] as SubjectScore;
					let isClickable = typeof score === 'object' && 'rank' in score;

					return html`<score-subject
						class="${isClickable ? 'clickable' : ''}"
						subject="${subject}"
						?clickable="${isClickable}"
						.data="${score}"
						.stats="${until(
							this.stats?.then((stats) => stats[subject]),
							null
						)}"
						@click="${isClickable ? this.showStatsHandler(subject) : () => {}}"
					></score-subject>`;
				}
			)}
			<slot name="afterscore"></slot>
		`;
	}

	private showStatsHandler(subject: string) {
		return (e: MouseEvent) => {
			e.preventDefault();
			this.dispatchEvent(new CustomEvent('stats', { detail: subject }));
		};
	}

	static styles = [
		ibmPlex,
		ibmPlexLooped,
		css`
			:host {
				display: block;
			}

			nav {
				display: flex;
				justify-content: flex-end;
				padding: 0 16px;
			}

			header {
				font-family: 'IBM Plex Sans Thai', sans-serif;
				font-weight: 500;
				padding: 0 16px 16px;
			}

			.greeting {
				font-size: 16pt;
			}

			.name {
				font-size: 36pt;
				margin-bottom: 16px;
			}

			.filename {
				font-family: 'IBM Plex Sans Thai Looped', sans-serif;
				font-weight: 400;
				border: #d4dae3 solid 1px;
				background: white;
				box-shadow:
					rgba(0, 0, 0, 0.12) 0 0 1px,
					rgba(0, 0, 0, 0.06) 0 2px 4px;
				padding: 12px 16px;
				border-radius: 8px;
				box-sizing: border-box;
			}

			.clickable {
				cursor: pointer;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'score-result': ScoreResult;
	}
}
