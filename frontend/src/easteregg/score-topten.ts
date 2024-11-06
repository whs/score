import { LitElement, css, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import topten from './topten.webp';
import flare from './flare.webp';
import bgm from './bgm.mp4';

@customElement('score-topten')
export class ScoreTopTen extends LitElement {
	render() {
		return html`<div class="inner">
			<div class="flare"></div>
			<div class="wrapper">
				<img src="${topten}" alt="ไอศครีมท็อปเท็น" />
			</div>
			<audio autoplay loop src="${bgm}"></audio>
		</div>`;
	}

	static styles = css`
		:host {
			display: block;
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			overflow: hidden;
			animation: blur ease-in 1s forwards;
			z-index: 1000;
		}

		.inner {
			position: relative;
			height: 100%;
			width: 100%;
		}

		.flare {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: url('${unsafeCSS(flare)}') no-repeat;
			background-position: center;
			background-size: contain;
			z-index: 100;
			animation:
				rotate linear 20s infinite,
				fade ease-in 3s;
		}

		.wrapper {
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		img {
			z-index: 101;
			display: block;
			width: 100%;
			margin: 0 16px;
			max-width: 720px;
			animation: zoomIn ease-in 2.5s;
		}

		@media (prefers-reduced-motion) {
			.flare {
				display: none;
			}
			img {
				animation: fade linear 1s;
			}
		}

		@keyframes blur {
			to {
				backdrop-filter: blur(48px);
			}
		}

		@keyframes rotate {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}

		@keyframes fade {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}

		@keyframes zoomIn {
			from {
				transform: scale(0);
			}
			to {
				transform: scale(1);
			}
		}
	`;
}

declare global {
	interface HTMLElementTagNameMap {
		'score-topten': ScoreTopTen;
	}
}
