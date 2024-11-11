import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('score-loading-scrim')
export class ScoreLoadingScrim extends LitElement {
	render() {
		return html`<slot></slot>`;
	}

	static styles = css`
		:host {
			display: flex;
			position: fixed;
			z-index: 100;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			justify-content: center;
			align-items: center;
			backdrop-filter: blur(48px);
			font-size: 24pt;
			font-family: 'IBM Plex Sans Thai', sans-serif;
			font-weight: 500;
			user-select: none;
		}
	`;
}

declare global {
	interface HTMLElementTagNameMap {
		'score-loading-scrim': ScoreLoadingScrim;
	}
}
