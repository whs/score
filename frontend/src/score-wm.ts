import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('score-wm')
export class WindowManager extends LitElement {
	@state()
	protected backstack: unknown[] = [document.createElement('slot')];

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('popstate', this.onPopState);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener('popstate', this.onPopState);
	}

	push(page: unknown) {
		this.backstack.push(page);
		if (this.backstack.length > 1) {
			window.history.pushState(null, '');
		}

		this.requestUpdate();
	}

	pop(amount: number = 1) {
		if (amount <= 0 || this.backstack.length <= 1) {
			return;
		}

		this.backstack.pop();
		this.requestUpdate();
	}

	onPopState = () => {
		// XXX: For now, forward is not handled
		this.pop();
	};

	protected render() {
		return this.backstack[this.backstack.length - 1];
	}

	static styles = css`
		:host {
			width: 100%;
			height: 100%;
			background-color: #ecf0f5;
			display: grid;
			box-sizing: border-box;
		}
	`;
}

@customElement('score-window')
export class Window extends LitElement {
	@property({ type: Boolean })
	noanim: boolean = false;

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
			padding: 10px 0;
			background-color: #ecf0f5;
			/*animation: slideright ease-out 500ms;*/
			z-index: 10;
		}

		:host([noanim]) {
			animation: none;
		}

		.inner {
			width: 100%;
			max-width: 720px;
		}

		@keyframes slideright {
			from {
				transform: translateX(100%);
			}

			to {
				transform: translateX(0);
			}
		}
	`;
}

declare global {
	interface HTMLElementTagNameMap {
		'score-wm': WindowManager;
	}
}
