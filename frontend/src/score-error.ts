import { LitElement, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('score-error')
export class ScoreError extends LitElement {
	render() {
		return document.createElement('slot');
	}

	static styles = css`
		:host {
			background: #c40009;
			color: white;
			padding: 5px;
			font-size: 10pt;
			text-align: center;
			border-radius: 5px;
			display: block;
		}
	`;
}

declare global {
	interface HTMLElementTagNameMap {
		'score-error': ScoreError;
	}
}
