import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../score-bar.ts';

/**
 * When using `score-bar`, remember to add the accessibility attributes as shown
 */
const meta: Meta = {
	title: 'Component/score-bar',
	component: 'score-bar',
	argTypes: {
		percent: {
			description: 'Value to display from 0-100',
			control: {
				type: 'range',
				min: 0,
				max: 100,
			},
		},
		noGlow: {
			description: 'Disable the glowing effect when value is 100',
			control: 'boolean',
			if: {
				arg: 'percent',
				eq: 100,
			},
		},
	},

	render: (args) =>
		html`<score-bar
			role="meter"
			aria-label="Score"
			aria-valuemin="0"
			aria-valuemax="100"
			aria-valuenow="${args.percent}"
			percent="${args.percent}"
			?noGlow="${args.noGlow}"
		></score-bar>`,
};

export default meta;
type Story = StoryObj;

export const Zero: Story = {
	args: {
		percent: 0,
	},
};

export const Ten: Story = {
	args: {
		percent: 10,
	},
};

export const TwentyFive: Story = {
	args: {
		percent: 25,
	},
};

export const Fifty: Story = {
	args: {
		percent: 50,
	},
};

export const Seventy: Story = {
	args: {
		percent: 70,
	},
};

export const Hundred: Story = {
	args: {
		percent: 100,
	},
};

export const NoGlow: Story = {
	args: {
		percent: 100,
		noGlow: true,
	},
};
