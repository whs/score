import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../score-font.ts';

/**
 * score-font adds Web Font to the top level document, regardless of its location.
 *
 * Web Fonts are not allowed to be declared in scoped CSS. However, Web Fonts
 * from the parent page are allowed to be used in scoped CSS.
 *
 * Currently, this component do not cleanup the fonts on unmount.
 */
const meta: Meta = {
	title: 'Utility/score-font',
	component: 'score-font',
	render: () => html`<score-font></score-font>`,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
