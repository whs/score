import { LitElement, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('score-loading-scrim')
export class ScoreLoadingScrim extends LitElement {
	render() {
		return document.createElement('slot');
	}

	static styles = css`
		:host {
			position: absolute;
			display: flex;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(100, 100, 100, 0.8);
			justify-content: center;
			align-items: center;
			color: white;
			font-size: 24pt;
			font-family: HelveticaNeue-UltraLight, thaisans, sans-serif;
			font-weight: 100;
		}
	`;
}

declare global {
	interface HTMLElementTagNameMap {
		'score-loading-scrim': ScoreLoadingScrim;
	}
}
