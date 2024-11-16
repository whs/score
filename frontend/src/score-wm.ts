import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

enum Animation {
	NO,
	ENTER,
	EXIT,
}

@customElement('score-wm')
export class WindowManager extends LitElement {
	@state()
	protected backstack: (Window | HTMLSlotElement)[] = [
		document.createElement('slot'),
	];

	@state()
	protected animation: Animation = Animation.NO;

	protected createRenderRoot() {
		let root = super.createRenderRoot();
		root.addEventListener('animationend', this.onAnimationEnd);
		root.addEventListener('animationcancel', this.onAnimationEnd);
		return root;
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('popstate', this.onPopState);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener('popstate', this.onPopState);
	}

	push(page: Window) {
		if (this.animation !== Animation.NO) {
			// Don't allow multiple navigation
			return;
		}

		this.backstack.push(page);
		if (this.backstack.length > 1) {
			window.history.pushState(null, '');
		}
		page.classList.add('in');
		page.ariaHidden = 'true';
		this.animation = Animation.ENTER;
		this.requestUpdate();
	}

	pop() {
		if (this.backstack.length <= 1) {
			return;
		}

		if (this.animation === Animation.EXIT) {
			// Express exit
			this.backstack.pop();
		}
		let exiting = this.backstack[this.backstack.length - 1];
		exiting.classList.add('out');
		exiting.ariaHidden = 'true';
		this.animation = Animation.EXIT;

		this.requestUpdate();
	}

	protected render() {
		let out;
		switch (this.animation) {
			case Animation.ENTER:
			case Animation.EXIT:
				out = [this.backstack.length - 2, this.backstack.length - 1];
				break;
			default:
				out = [this.backstack.length - 1];
		}

		return html`${repeat(
			out,
			(v) => v,
			(v) => this.backstack[v]
		)}`;
	}

	private onPopState = () => {
		// XXX: For now, forward is not handled
		this.pop();
	};

	private onAnimationEnd = () => {
		switch (this.animation) {
			case Animation.ENTER:
				this.backstack[this.backstack.length - 1].ariaHidden = 'false';
				this.backstack[this.backstack.length - 1].classList.remove('in');
				break;
			case Animation.EXIT:
				this.backstack.pop();
				break;
		}
		this.animation = Animation.NO;
	};

	static styles = css`
		:host {
			width: 100%;
			height: 100%;
			background-color: #ecf0f5;
			display: grid;
			box-sizing: border-box;
		}

		.in {
			animation: in ease-out 500ms;
		}
		.out {
			animation: out ease-out 500ms;
		}

		@media (prefers-reduced-motion) {
			.in,
			.out {
				animation-duration: 0s;
			}
		}

		@keyframes in {
			from {
				transform: translateX(100%);
			}

			to {
				transform: translateX(0);
			}
		}
		@keyframes out {
			from {
				transform: translateX(0);
			}

			to {
				transform: translateX(100%);
			}
		}
	`;
}

@customElement('score-window')
export class Window extends LitElement {
	render() {
		return html`<div class="inner"><slot></slot></div>`;
	}

	static styles = css`
		:host {
			display: flex;
			width: 100%;
			height: 100%;
			grid-column: 1;
			grid-row: 1;
			justify-content: center;
			background-color: #ecf0f5;
			z-index: 10;
		}

		.inner {
			width: 100%;
			max-width: 720px;
		}
	`;
}

declare global {
	interface HTMLElementTagNameMap {
		'score-wm': WindowManager;
		'score-window': Window;
	}
}
