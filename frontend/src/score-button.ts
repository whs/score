import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('score-button')
export class ScoreButton extends LitElement {
	render() {
		return html`<slot></slot>`;
	}

	static styles = css`
		:host {
			display: inline-block;
			cursor: pointer;
			padding: 6px 8px;
			border-radius: 8px;
			border: #d4dae3 solid 1px;
			background: white;
			box-shadow:
				rgba(0, 0, 0, 0.12) 0 0 1px,
				rgba(0, 0, 0, 0.06) 0 2px 4px;
			font-family: 'IBM Plex Sans Thai', sans-serif;
			font-weight: 700;
			font-size: 12px;
		}
	`;
}

declare global {
	interface HTMLElementTagNameMap {
		'score-button': ScoreButton;
	}
}
