import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('whs-score')
export class WhsScore extends LitElement {
  @property()
  apiBase: string = 'data';

  private fileList: Promise<FileList>|undefined;

  connectedCallback() {
    super.connectedCallback();
    this.fileList = fetch(`${this.apiBase}/files.json`).then(v => v.json()) as Promise<FileList>;
  }

  render() {
    return html`
      <score-form @submit=${this.onSubmit} .fileList=${this.fileList}>
        <slot name="header" slot="header"></slot>
        <slot name="username" slot="username"></slot>
        <slot name="password" slot="password"></slot>
        <slot name="beforefilelist" slot="beforefilelist"></slot>
        <slot name="beforesubmit" slot="beforesubmit"></slot>
        <slot name="footer" slot="footer"></slot>
      </score-form>
    `
  }

  private onSubmit(e: CustomEvent) {
    e.preventDefault()
    console.log(e.detail)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'whs-score': WhsScore
  }
}
