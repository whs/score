import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

@customElement('score-bar')
export class ScoreBar extends LitElement {
	@property({ type: Number })
	percent: number = 0;

	@property({ type: Boolean })
	noGlow: boolean = false;

	render() {
		return html`<div
			class="completed completed-${this.getProgressBarBreakpoint()} ${this
				.noGlow
				? 'noglow'
				: null}"
			part="bar"
			style="${styleMap({ width: `${this.percent}%` })}"
		></div>`;
	}

	private getProgressBarBreakpoint(): string {
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
			box-sizing: border-box;
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
					rgba(255, 0, 0, 1) 0%,
					rgba(255, 154, 0, 1) 10%,
					rgba(208, 222, 33, 1) 20%,
					rgba(79, 220, 74, 1) 30%,
					rgba(63, 218, 216, 1) 40%,
					rgba(47, 201, 226, 1) 50%,
					rgba(28, 127, 238, 1) 60%,
					rgba(95, 21, 242, 1) 70%,
					rgba(186, 12, 248, 1) 80%,
					rgba(251, 7, 217, 1) 90%,
					rgba(255, 0, 0, 1) 100%
				)
				0 0/200% 100%;
			position: relative;
			animation: bgpos linear 2s infinite;
		}
		.completed-100:not(.noglow)::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
			background: linear-gradient(
					to right,
					rgba(255, 0, 0, 1) 0%,
					rgba(255, 154, 0, 1) 10%,
					rgba(208, 222, 33, 1) 20%,
					rgba(79, 220, 74, 1) 30%,
					rgba(63, 218, 216, 1) 40%,
					rgba(47, 201, 226, 1) 50%,
					rgba(28, 127, 238, 1) 60%,
					rgba(95, 21, 242, 1) 70%,
					rgba(186, 12, 248, 1) 80%,
					rgba(251, 7, 217, 1) 90%,
					rgba(255, 0, 0, 1) 100%
				)
				0 0/200% 100%;
			filter: blur(8px);
			animation: bgpos linear 2s infinite;
		}

		@media (prefers-reduced-motion) {
			.completed-100,
			.completed-100::after {
				animation: none;
			}
		}

		@keyframes bgpos {
			to {
				background-position: -200% 0;
			}
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
