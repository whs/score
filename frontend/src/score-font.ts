import { LitElement, unsafeCSS, adoptStyles } from 'lit';
import { customElement } from 'lit/decorators.js';
import ibmPlex500 from '@fontsource/ibm-plex-sans-thai/500.css?inline';
import ibmPlex700 from '@fontsource/ibm-plex-sans-thai/700.css?inline';
import ibmPlexLooped400 from '@fontsource/ibm-plex-sans-thai-looped/400.css?inline';

@customElement('score-font')
export class ScoreFont extends LitElement {
	connectedCallback() {
		// Shadow dom do not support @font-face. This component inject font-face into the document
		super.connectedCallback();
		adoptStyles(document as any, [
			unsafeCSS(ibmPlex500),
			unsafeCSS(ibmPlex700),
			unsafeCSS(ibmPlexLooped400),
		]);
	}

	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'score-font': ScoreFont;
	}
}
