import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import ibmPlex from '@fontsource/ibm-plex-sans-thai/500.css?inline&lit';
import ibmPlexLooped from '@fontsource/ibm-plex-sans-thai-looped/400.css?inline&lit';
import { ScoreSubjectStats, SubjectScore } from './schema.ts';
import { msg, str } from '@lit/localize';
import ranks from './ranks';
import icRightUp from 'remixicon/icons/Arrows/arrow-right-up-line.svg';
import './score-bar.ts';

@customElement('score-subject')
export class ScoreSubject extends LitElement {
	@property()
	subject: string = '';

	@property()
	data: SubjectScore | undefined;

	@property()
	stats: ScoreSubjectStats | null | undefined;

	@property({ type: Boolean })
	clickable: boolean = false;

	numberFormatter = new Intl.NumberFormat(undefined, {
		maximumFractionDigits: 4,
	});

	render() {
		let score = this.data!;

		let fullMarks = this.getFullMark();

		if (fullMarks === null || !('percent' in score)) {
			let scoreValue = typeof score === 'object' ? score.score : score;
			return html`
				<div class="subject">
					<div class="subjectname">${this.subject}</div>
					${this.clickable
						? html`<div class="icons">
								<img src="${icRightUp}" alt="${msg('See more')}" />
							</div>`
						: ''}
				</div>
				${scoreValue}
			`;
		}

		return html`
			<div class="subject">
				<div class="subjectname">${this.subject}</div>
				<div class="icons">
					${ranks[score.rank.toString()]
						? html`<img
								src="${ranks[score.rank.toString()]}"
								alt="${this.numberFormatter.format(score.rank)}"
							/>`
						: null}
					${this.clickable
						? html`<img src="${icRightUp}" alt="${msg('See more')}" />`
						: null}
				</div>
			</div>
			<score-bar percent="${score.percent}"></score-bar>
			<div class="legend">
				<div class="legend-left">
					${msg(
						str`Score: ${this.numberFormatter.format(score.score as number)}`
					)}
				</div>
				<div class="legend-right">
					${this.numberFormatter.format(fullMarks)}
				</div>
			</div>
		`;
	}

	getFullMark(): number | null {
		if (this.stats) {
			return this.stats.max;
		}

		// If the stats file is not loaded, calculate it locally
		let result = this.subject.match(/\(([0-9.]+)\)$/);
		if (!result) {
			return null;
		}
		return parseFloat(result[1]);
	}

	static styles = [
		ibmPlex,
		ibmPlexLooped,
		css`
			:host {
				display: block;
				border-radius: 24px;
				background: white;
				padding: 16px;
				margin-bottom: 2px;
				font-family: 'IBM Plex Sans Thai Looped', sans-serif;
				font-weight: 400;
				box-sizing: border-box;
			}

			.subject {
				margin-bottom: 8px;
				line-height: 32px;
				display: flex;
				justify-content: space-between;
			}

			.subjectname {
				font-family: 'IBM Plex Sans Thai', sans-serif;
				font-weight: 500;
				font-size: 16pt;
			}

			.icons img {
				height: 32px;
				width: 32px;
			}

			.legend {
				font-size: 10pt;
				color: #656e7c;
				display: flex;
				justify-content: space-between;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'score-subject': ScoreSubject;
	}
}
