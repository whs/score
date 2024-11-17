import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../score-loading-scrim.ts';

/**
 * score-loading-scrim blurs underlying background.
 *
 * Use `role="status"` attribute to indicate to let screen readers know of this popup
 */
const meta: Meta = {
	title: 'score-loading-scrim',
	component: 'score-loading-scrim',
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		html`<score-loading-scrim role="status">Loading...</score-loading-scrim>`,
};
