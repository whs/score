import { LitElement, html, svg, nothing, render, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './score-result.ts';
import { ScoreStats, UserScore } from './schema.ts';
import { createRef, ref } from 'lit/directives/ref.js';

@customElement('score-share')
export class ScoreShare extends LitElement {
	@property()
	data!: UserScore;
	@property()
	stats!: ScoreStats;

	canvas: HTMLCanvasElement;

	constructor() {
		super();
		this.canvas = document.createElement('canvas');
		this.appendChild(this.canvas);
	}

	protected update(_changedProperties: PropertyValues) {
		let img = new Image();
		img.src = 'data:image/svg+xml;base64,' + btoa(this.getSvg());
		console.log(img.src);

		let ctx = this.canvas.getContext('2d')!;
		img.onload = () => {
			console.log(img.width, img.height);
			this.canvas.width = img.width;
			this.canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
		};
	}

	getSvgTemplate() {
		return html` <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
			<foreignObject x="0" y="0" width="200" height="200">
				${Object.keys(this.data!).map((subject) => {
					if (subject.startsWith('_')) {
						return nothing;
					}

					return html`<score-subject
						xmlns="http://www.w3.org/1999/xhtml"
						subject="${subject}"
						.data="${this.stats[subject]}"
					></score-subject>`;
				})}
			</foreignObject>
		</svg>`;
	}

	getSvg() {
		let df = document.createDocumentFragment();
		let svg = this.getSvgTemplate();

		render(svg, df);
		return new XMLSerializer().serializeToString(df.firstElementChild!);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'score-share': ScoreShare;
	}
}
