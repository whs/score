import { LitElement, css, html, nothing, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import nyanCat from './easteregg/nyan.gif';

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
		>
			${this.percent === 100
				? html`<div class="fragments">
						${this.frag(window.innerWidth / 60)}
						<div class="catfrag"></div>
					</div>`
				: nothing}
			${this.percent === 100
				? html`<img
						class="nyancat"
						src="${nyanCat}"
						alt="Nyan cat"
						aria-hidden="true"
					/>`
				: nothing}
		</div>`;
	}

	private frag(n: number): TemplateResult[] {
		let out = [];
		for (let i = 0; i < n; i++) {
			out.push(html`<div class="frag"></div>`);
		}
		return out;
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
			background: none;
			position: relative;

			--nyan-speed: 300ms;
		}

		.completed-100 .fragments {
			width: 100%;
			height: 100%;
			display: flex;
			align-content: flexstart;
		}
		.completed-100 .nyancat {
			position: absolute;
			height: 200%;
			top: -40%;
			right: 0;
			image-rendering: pixelated;
			z-index: 5;
		}

		.completed-100 .catfrag {
			/* set this to image size of nyan.gif */
			aspect-ratio: 264 / 160;
		}

		.completed-100 .frag {
			background: linear-gradient(
				to bottom,
				#d91a12 0%,
				#d91a12 15%,
				#e13300 15%,
				#ff7f14 16%,
				#f2ab03 32%,
				#ebc000 32%,
				#fade00 33%,
				#efff03 48%,
				#56fc02 49%,
				#52ff01 66%,
				#4ade7e 67%,
				#3baaf2 67%,
				#3baaf2 84%,
				#7337f7 84%,
				#6b40f2 100%
			);
			flex: 1;
			animation: nyan linear var(--nyan-speed) infinite;
		}
		.completed-100.noglow .frag {
			height: calc(100% - 2px);
		}

		.completed-100 .frag:nth-child(even) {
			animation-delay: calc(var(--nyan-speed) * -1 / 2);
		}

		@media (prefers-reduced-motion) {
			.frag {
				animation: none;
			}
			.completed-100 .frag:nth-child(even) {
				transform: translateY(4px);
			}
		}

		@keyframes nyan {
			0% {
				transform: translateY(0);
			}
			49.999% {
				transform: translateY(0);
			}
			50% {
				transform: translateY(4px);
			}
			99.999% {
				transform: translateY(4px);
			}
		}
	`;
}

declare global {
	interface HTMLElementTagNameMap {
		'score-bar': ScoreBar;
	}
}
