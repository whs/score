import { LitElement, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('score-round-button')
export class ScoreRoundButton extends LitElement {
	render() {
		return document.createElement('slot');
	}

	static styles = css`
		:host {
			display: block;
			border-radius: 24px;
			padding: 10px;
			background: white;
			border: #d4dae3 solid 1px;
			box-shadow:
				rgba(0, 0, 0, 0.12) 0 0 1px,
				rgba(0, 0, 0, 0.06) 0 2px 4px;
			cursor: pointer;
			width: 20px;
			height: 20px;
		}
	`;
}

declare global {
	interface HTMLElementTagNameMap {
		'score-round-button': ScoreRoundButton;
	}
}
