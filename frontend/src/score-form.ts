import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import {repeat} from 'lit/directives/repeat.js';
import {until} from 'lit/directives/until.js';
import {FileList, FileState} from "./schema.ts";

@customElement('score-form')
export class ScoreForm extends LitElement {
	@property()
	fileList: Promise<FileList> = Promise.reject();

	render() {
		return html`
            <form @submit=${this.onSubmit}>
                <slot name="header"></slot>
                <label class="input">
                    <slot name="username">เลขประจำตัว</slot>
                    <input type="text" name="username" inputmode="numeric" required autofocus>
                </label>
                <label class="input">
                    <slot name="password">รหัสผ่าน</slot>
                    <input type="password" name="password" inputmode="numeric" required>
                </label>
                <slot name="beforefilelist"></slot>
                <div class="files">${until(this.fileList.then(
					(files) => html`${repeat(Object.values(files), file => html`<label><input type="radio" name="file" value="${file.id}" ?disabled=${file.uploaded !== FileState.COMPLETE} required>${file.name}</label>`)}`,
						(e) => html`ไม่สามารถโหลดข้อมูลได้ เนื่องจาก <p><code>${e}</code></p>`
				), html`กำลังเรียกข้อมูล...`)}</div>
                <slot name="beforesubmit"></slot>
                <input type="submit" value="แสดง" ?disabled=${until(this.fileList.then(() => false), true)}>
                <slot name="footer"></slot>
            </form>
		`
	}

	private onSubmit(e: SubmitEvent) {
		e.preventDefault();

		let formData = new FormData(e.target as HTMLFormElement, e.submitter)

		let event = new CustomEvent('submit', {
			detail: {
				username: formData.get("username"),
				password: formData.get("password"),
				file: formData.get("file"),
			},
		});

		this.dispatchEvent(event);
	}

	static styles = css`
        :host {
            display: block;
            margin: 10px 0 0 10px;
            background: linear-gradient(180deg, #71c0ff, white 20%), white;
            padding: 10px;
            width: 400px;
        }

        input[type=text], input[type=password] {
            display: block;
            border: #ccc solid 1px;
            width: 100%;
            font-family: HelveticaNeue-UltraLight, thaisans, sans-serif;
            font-size: 18pt;
        }

        input:hover {
            border: #aaa solid 1px;
        }

        input:focus {
            border: #222 solid 1px;
            outline: none;
            box-shadow: inset #ccc 2px 2px 2px;
        }

        input[type=submit] {
            margin-top: 10px;
            width: 100%;
        }
		
		.input{
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
			margin-bottom: 0.8rem;
        }
	`
}

declare global {
	interface HTMLElementTagNameMap {
		'score-form': ScoreForm
	}
}
