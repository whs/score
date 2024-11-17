import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('score-error')
export class ScoreError extends LitElement {
	render() {
		return html`<slot></slot>`;
	}

	static styles = css`
		:host {
			background: white;
			color: #c40009;
			border: #c40009 solid 2px;
			padding: 16px;
			text-align: center;
			border-radius: 8px;
			display: block;
			margin-bottom: 8px;
			box-shadow:
				#0000001f 0 0 1px,
				#0000000f 0 2px 4px;
			font-family: 'IBM Plex Sans Thai', sans-serif;
			font-size: 16px;
			font-weight: 500;
		}
	`;
}

declare global {
	interface HTMLElementTagNameMap {
		'score-error': ScoreError;
	}
}
