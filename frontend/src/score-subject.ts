import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import ibmPlex from '@fontsource/ibm-plex-sans-thai/500.css?inline&lit';
import ibmPlexLooped from '@fontsource/ibm-plex-sans-thai-looped/400.css?inline&lit';
import { ScoreSubjectStats, SubjectScore } from './schema.ts';
import { msg, str } from '@lit/localize';
import icRightUp from 'remixicon/icons/Arrows/arrow-right-up-line.svg';

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
					${this.clickable
						? html`<img src="${icRightUp}" alt="${msg('See more')}" />`
						: null}
				</div>
			</div>
			<div class="bar">
				<div
					class="completed completed-${this.getProgressBarBreakpoint()}"
					style="${styleMap({ width: `${score.percent}%` })}"
				></div>
			</div>
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

	getProgressBarBreakpoint(): string {
		if (typeof this.data !== 'object' || !('percent' in this.data)) {
			return '';
		}

		const cssBarBreakpoints = [100, 70, 50, 25, 0];
		for (let bp of cssBarBreakpoints) {
			if (this.data.percent >= bp) {
				return bp.toString();
			}
		}

		return '0';
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
				height: 24px;
				width: 24px;
			}

			.bar {
				width: 100%;
				height: 20px;
				border-radius: 24px;
				padding: 2px;
				background: #f1f4f9;
			}

			.bar .completed {
				border-radius: 24px;
				background: linear-gradient(to right, #ed4f44, #ed8d44);
				height: 100%;
				animation: bar ease-out 1.5s;
			}

			.bar .completed-25 {
				background: linear-gradient(to right, #ed8d44, #f0c019);
			}
			.bar .completed-50 {
				background: linear-gradient(to right, #10dfb9, #10d8df);
			}
			.bar .completed-70 {
				background: linear-gradient(to right, #9adf10, #10df87);
			}
			.bar .completed-100 {
				background: linear-gradient(
					to right,
					#bf2ee6,
					#1aaff0,
					#0cd824,
					#f0d71f,
					#ec4a18
				);
				position: relative;
			}
			.bar .completed-100::after {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				height: 20px;
				width: 100%;
				background: linear-gradient(
					to right,
					#bf2ee6,
					#1aaff0,
					#0cd824,
					#f0d71f,
					#ec4a18
				);
				filter: blur(8px);
			}

			.legend {
				font-size: 10pt;
				color: #656e7c;
				display: flex;
				justify-content: space-between;
			}

			@keyframes bar {
				from {
					width: 0;
				}
				/* delay the start for a bit for the page transition */
				${0.5 / 1.5}% {
					width: 0;
				}
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'score-subject': ScoreSubject;
	}
}
