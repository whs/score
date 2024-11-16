import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { until } from 'lit/directives/until.js';
import { FileList, FileState } from './schema.ts';
import './score-error.ts';
import { localized, msg } from '@lit/localize';

@customElement('score-form')
@localized()
export class ScoreForm extends LitElement {
	@property()
	fileList: Promise<FileList> = new Promise(() => {});

	@property()
	usernameInputMode: string = 'numeric';
	@property()
	passwordInputMode: string = 'numeric';

	render() {
		return html`
			<form @submit=${this.onSubmit}>
				<slot name="header"></slot>
				<div class="body">
					<slot name="header-in"></slot>
					<label class="input">
						<slot name="username">${msg('Student ID')}</slot>
						<input
							type="text"
							name="username"
							inputmode="${this.usernameInputMode}"
							required
							autofocus
						/>
					</label>
					<label class="input">
						<slot name="password">${msg('Password')}</slot>
						<input
							type="password"
							name="password"
							inputmode="${this.passwordInputMode}"
							required
						/>
					</label>
					<slot name="beforefilelist"></slot>
					<ul class="files">
						${until(
							this.fileList.then(
								(files) =>
									repeat(
										Object.values(files),
										(file) => file.id,
										(file) =>
											html`<li>
												<label
													><input
														type="radio"
														name="file"
														value="${file.id}"
														?disabled=${file.uploaded !== FileState.COMPLETE}
														required
													/>
													${file.name}</label
												>
											</li>`
									),
								() =>
									html`<score-error>${msg('Unable to load data')}</score-error>`
							),
							html`<li><span>${msg('Loading...')}</span></li>`
						)}
					</ul>
					<slot name="beforesubmit"></slot>
					<input
						type="submit"
						value="${msg('Show')}"
						?disabled=${until(
							this.fileList.then(() => false),
							true
						)}
					/>
					<slot name="footer"></slot>
				</div>
			</form>
		`;
	}

	private onSubmit(e: SubmitEvent) {
		e.preventDefault();

		let formData = new FormData(e.target as HTMLFormElement, e.submitter);

		let event = new CustomEvent<ScoreFormSubmitEvent>('submit', {
			detail: {
				username: formData.get('username') as string,
				password: formData.get('password') as string,
				file: formData.get('file') as string,
			},
		});

		this.dispatchEvent(event);
	}

	static styles = css`
		:host {
			display: block;
		}

		.body {
			background: white;
			border-radius: 16px;
			padding: 16px;
			font-family: 'IBM Plex Sans Thai', sans-serif;
			font-size: 16px;
			font-weight: 500;
		}

		.input {
			display: block;
			margin-bottom: 16px;
			line-height: 26px;
		}

		input[type='text'],
		input[type='password'] {
			font-family: 'IBM Plex Sans Thai Looped', sans-serif;
			font-weight: 400;
			display: block;
			width: 100%;
			box-sizing: border-box;
			font-size: 16px;
			padding: 12px 16px;
			border: none;
			outline: #d4dae3 solid 1px;
			border-radius: 8px;
			box-shadow:
				#0000001f 0 0 1px,
				#0000000f 0 2px 4px;
			transition: outline linear 100ms;
		}

		input[type='text']:focus,
		input[type='password']:focus {
			outline: #131313 solid 2px;
		}

		input[type='submit'] {
			display: block;
			width: 100%;
			padding: 12px 16px;
			text-align: center;
			border-radius: 8px;
			background: #131313;
			border: none;
			color: white;
			font-family: 'IBM Plex Sans Thai', sans-serif;
			font-size: 16px;
			font-weight: 700;
			box-shadow:
				#0000001f 0 0 1px,
				#0000000f 0 2px 4px;
		}

		.files {
			list-style: none;
			padding: 0;
			margin: 0;
			margin-bottom: 24px;
		}

		.files li {
			margin-bottom: 8px;
		}

		.files label {
			display: flex;
			align-items: center;
			outline: #d4dae3 solid 1px;
			margin: 1px;
			padding: 16px;
			border-radius: 8px;
			transition: outline linear 100ms;
			box-shadow:
				#0000001f 0 0 1px,
				#0000000f 0 2px 4px;
			font-family: 'IBM Plex Sans Thai Looped', sans-serif;
			font-weight: 400;
		}

		.files label:has(> :checked) {
			outline: #131313 solid 2px;
		}

		.files label:has(> :disabled) {
			border: #00000026 solid 1px;
			background: #00000008;
			color: #00000026;
		}

		.files input[type='radio'] {
			appearance: none;
			background-color: white;
			margin: 0;
			margin-right: 16px;
			box-shadow:
				#0000001f 0 0 1px,
				#0000000f 0 2px 4px;
			border: #d4dae3 solid 1px;
			width: 1.5em;
			height: 1.5em;
			border-radius: 50%;
			box-sizing: border-box;
			transition:
				background-color linear 100ms,
				border-color linear 100ms;
			display: grid;
			place-content: center;
		}

		.files input[type='radio']::before {
			content: '';
			width: 0.75em;
			height: 0.75em;
			border-radius: 50%;
			transform: scale(0);
			transition: 120ms transform ease-in-out;
			background: white;
		}

		.files input[type='radio']:checked {
			background: black;
			border: black solid 1px;
		}

		.files input[type='radio']:checked::before {
			transform: scale(1);
		}

		.files input[type='radio']:disabled {
			border: #00000026 solid 1px;
			background: #00000008;
		}
	`;
}

export interface ScoreFormSubmitEvent {
	username: string;
	password: string;
	file: string;
}

declare global {
	interface HTMLElementTagNameMap {
		'score-form': ScoreForm;
	}
}
