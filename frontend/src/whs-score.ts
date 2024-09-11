import {LitElement, html} from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import './score-form.ts'
import {getFileNameV1, pbkdf2} from "./utils.ts";
import {ScoreFormSubmitEvent} from "./score-form.ts";

@customElement('whs-score')
export class WhsScore extends LitElement {
  @property()
  apiBase: string = 'data';

  @property()
  usernameInputMode: string = 'numeric'
  @property()
  passwordInputMode: string = 'numeric'

  @state()
  isSha1Supported = typeof window.crypto.subtle.decrypt === 'function'

  @state()
  isPbkdf2Supported = typeof window.crypto.subtle.deriveBits === 'function' && typeof window.crypto.subtle.importKey === 'function'

  private fileList: Promise<FileList>|undefined;

  constructor() {
    super();

    if(this.isSha1Supported) {
      window.crypto.subtle.digest('SHA-1', new Uint8Array()).catch(() => this.isSha1Supported = false);
    }

    if(this.isPbkdf2Supported) {
      pbkdf2('', '', 1).catch(() => this.isPbkdf2Supported = false);
    }
  }

  connectedCallback() {
    super.connectedCallback();

    this.fileList = fetch(`${this.apiBase}/files.json`).then(v => v.json()) as Promise<FileList>;
  }

  render() {
    return html`
      <score-form usernameinputmode="${this.usernameInputMode}" passwordinputmode="${this.passwordInputMode}" @submit=${this.onSubmit} .fileList=${this.fileList}>
        <div slot="header">
          <slot name="header"></slot>
          ${this.isBrowserSupported() ? null : html`<score-error>Browser นี้ไม่สามารถใช้งานได้ กรุณาใช้ Firefox 130 เป็นต้นไป</score-error>`}
        </div>
        <slot name="username" slot="username"></slot>
        <slot name="password" slot="password"></slot>
        <slot name="beforefilelist" slot="beforefilelist"></slot>
        <slot name="beforesubmit" slot="beforesubmit"></slot>
        <slot name="footer" slot="footer"></slot>
      </score-form>
    `
  }

  isBrowserSupported(): boolean {
    return this.isSha1Supported && this.isPbkdf2Supported && typeof TextEncoder === 'function'
  }

  private async onSubmit(e: CustomEvent<ScoreFormSubmitEvent>) {
    e.preventDefault()
    console.time('file hash')
    console.log(await getFileNameV1(e.detail.file, e.detail.username, e.detail.password))
    console.timeEnd('file hash')
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'whs-score': WhsScore
  }
}
