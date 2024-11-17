import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../score-error.ts';

/**
 * When using `score-error`, use `role="alert"` to make screen readers immediately pay attention to it
 */
const meta: Meta = {
	title: 'Component/score-error',
	component: 'score-error',
	render: () => html`<score-error role="alert">OMG</score-error>`,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
