import { customElement, property } from 'lit/decorators.js';
import { html, LitElement, nothing } from 'lit';
import LinkifyIt, {
	Options as LinkifyOptions,
	SchemaRules as LinkifySchema,
} from 'linkify-it';

@customElement('score-auto-link')
export class ScoreAutoLink extends LitElement {
	@property()
	linkSchemas: LinkifySchema = {};
	@property()
	linkOptions: LinkifyOptions = {};

	observer: MutationObserver;

	constructor() {
		super();
		this.observer = new MutationObserver(this.onChange);
		this.observer.observe(this, { characterData: true, subtree: true });
	}

	onChange = () => {
		this.requestUpdate();
	};

	render() {
		let textContent = this.textContent;
		if (!textContent) {
			return nothing;
		}

		const linker = new LinkifyIt(this.linkSchemas, {
			fuzzyEmail: false,
		});
		linker.set(this.linkOptions);

		let lastIndex = 0;
		let out = [];
		for (let match of linker.match(textContent) || []) {
			out.push(textContent.slice(lastIndex, match.index));
			out.push(html`<a href="${match.url}" target="_blank">${match.text}</a>`);
			lastIndex = match.lastIndex;
		}
		out.push(textContent.slice(lastIndex));

		return out;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'score-auto-link': ScoreAutoLink;
	}
}
