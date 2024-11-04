import { LitElement, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import ibmPlex from '@fontsource/ibm-plex-sans-thai/500.css?inline&lit';

@customElement('score-loading-scrim')
export class ScoreLoadingScrim extends LitElement {
	render() {
		return document.createElement('slot');
	}

	static styles = [
		ibmPlex,
		css`
			:host {
				display: flex;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				justify-content: center;
				align-items: center;
				color: black;
				font-size: 24pt;
				font-family: 'IBM Plex Sans Thai', sans-serif;
				font-weight: 500;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'score-loading-scrim': ScoreLoadingScrim;
	}
}
