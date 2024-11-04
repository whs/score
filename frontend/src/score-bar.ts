import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

@customElement('score-bar')
export class ScoreBar extends LitElement {
	@property({ type: Number })
	percent: number = 0;

	render() {
		return html`
			<div
				class="completed completed-${this.getProgressBarBreakpoint()}"
				style="${styleMap({ width: `${this.percent}%` })}"
			></div>
		</div>`;
	}

	getProgressBarBreakpoint(): string {
		const cssBarBreakpoints = [100, 70, 50, 25, 0];
		for (let bp of cssBarBreakpoints) {
			if (this.percent >= bp) {
				return bp.toString();
			}
		}

		return '0';
	}

	static styles = css`
		:host {
			display: block;
			width: 100%;
			height: 20px;
			border-radius: 24px;
			padding: 2px;
			background: #f1f4f9;
		}

		.completed {
			border-radius: 24px;
			background: linear-gradient(to right, #ed4f44, #ed8d44);
			height: 100%;
			/*animation: bar ease-out 1.5s;*/
		}

		.completed-25 {
			background: linear-gradient(to right, #ed8d44, #f0c019);
		}
		.completed-50 {
			background: linear-gradient(to right, #10dfb9, #10d8df);
		}
		.completed-70 {
			background: linear-gradient(to right, #9adf10, #10df87);
		}
		.completed-100 {
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
		.completed-100::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
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

		@keyframes bar {
			from {
				width: 0;
			}
			/* delay the start for a bit for the page transition */
			${0.5 / 1.5}% {
				width: 0;
			}
		}
	`;
}

declare global {
	interface HTMLElementTagNameMap {
		'score-bar': ScoreBar;
	}
}
