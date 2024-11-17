import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import '../score-button.ts';
import icQuestion from 'remixicon/icons/System/question-line.svg';

/**
 * When using `score-button`, add `tabindex` and `role` attributes.
 *
 * If you're binding to `@click`, remember to provide the same functionality to `@keyup` as well
 */
const meta: Meta = {
	title: 'Component/score-button',
	component: 'score-button',
};

export default meta;
type Story = StoryObj;

export const Text: Story = {
	render: () =>
		html`<score-button
			tabindex="0"
			role="button"
			@click="${action('click')}"
			@keyup="${action('keyup')}"
			>Test</score-button
		>`,
};

export const IconOnly: Story = {
	render: () =>
		html`<score-button
			tabindex="0"
			role="button"
			@click="${action('click')}"
			@keyup="${action('keyup')}"
			><img
				src="${icQuestion}"
				style="height: 1.2em; vertical-align: middle;"
				alt="?"
		/></score-button>`,
};

export const IconText: Story = {
	render: () =>
		html`<score-button
			tabindex="0"
			role="button"
			@click="${action('click')}"
			@keyup="${action('keyup')}"
			><img
				src="${icQuestion}"
				style="height: 1.2em; vertical-align: middle;"
				alt="?"
				aria-hidden="true"
			/>
			What??</score-button
		>`,
};
