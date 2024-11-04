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
				<div class="files">
					${until(
						this.fileList.then(
							(files) =>
								repeat(
									Object.values(files),
									(file) => file.id,
									(file) =>
										html`<label
											><input
												type="radio"
												name="file"
												value="${file.id}"
												?disabled=${file.uploaded !== FileState.COMPLETE}
												required
											/>${file.name}</label
										>`
								),
							() =>
								html`<score-error>${msg('Unable to load data')}</score-error>`
						),
						msg('Loading...')
					)}
				</div>
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
			background: linear-gradient(180deg, #71c0ff, white 20%), white;
			padding: 10px;
			width: 100%;
			box-sizing: border-box;
		}

		input[type='text'],
		input[type='password'] {
			display: block;
			border: #ccc solid 1px;
			width: 100%;
			font-family: HelveticaNeue-UltraLight, thaisans, sans-serif;
			font-size: 18pt;
			box-sizing: border-box;
		}

		input:hover {
			border: #aaa solid 1px;
		}

		input:focus {
			border: #222 solid 1px;
			outline: none;
			box-shadow: inset #ccc 2px 2px 2px;
		}

		input[type='submit'] {
			margin-top: 10px;
			width: 100%;
		}

		.input {
			display: block;
			margin-top: 10px;
			font-family: thaisans, sans-serif;
			font-weight: 400;
		}

		.files {
			padding: 10px;
			background: #fff2ca;
			font-family: thaisans, sans-serif;
			margin-top: 20px;
			font-size: 12pt;
		}

		.files label {
			display: block;
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
