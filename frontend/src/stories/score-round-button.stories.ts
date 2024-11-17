import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../score-round-button.ts';
import icQuestion from 'remixicon/icons/System/question-line.svg';
import { action } from '@storybook/addon-actions';

/**
 * When using `score-round-button`, add `tabindex` and `role` attributes.
 *
 * If you're binding to `@click`, remember to provide the same functionality to `@keyup` as well
 */
const meta: Meta = {
	title: 'Component/score-round-button',
	component: 'score-round-button',
};

export default meta;
type Story = StoryObj;

export const Icon: Story = {
	render: () =>
		html`<score-round-button
			tabindex="0"
			role="button"
			@click="${action('click')}"
			@keyup="${action('keyup')}"
			><img src="${icQuestion}" alt="?"
		/></score-round-button>`,
};
