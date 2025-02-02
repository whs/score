import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../score-subject.ts';

const meta: Meta = {
	title: 'Component/score-subject',
	component: 'score-subject',
	args: {
		subject: 'Example (50)',
		freetext: 'Example',
		score: 10,
		rank: 1,
		percent: 80,
		standard: 1,
		clickable: true,
		allowHtml: false,
		autoLink: false,
	},
	argTypes: {
		subject: {
			description:
				'Subject name. If it ends with `(number)`, then the number is treated as the full marks of the subject',
		},
		clickable: {
			description:
				'Whether the control should show click arrow. The click functionality is not provided - use standard onClick event',
			control: 'boolean',
		},
		score: {
			control: {
				type: 'number',
				min: 0,
			},
		},
		rank: {
			control: {
				type: 'number',
				min: 1,
			},
		},
		percent: {
			control: {
				type: 'range',
				min: 0,
				max: 100,
			},
		},
		allowHtml: {
			description:
				"Allow HTML in string result. This option doesn't work with autoLink",
		},
		autoLink: {
			description:
				"Auto link in string result. This option doesn't work with allowHtml",
		},
	},
};

export default meta;
type Story = StoryObj;

export const Score: Story = {
	render: (args) =>
		html`<score-subject
			subject="${args.subject}"
			.data="${{
				score: args.score,
				rank: args.rank,
				percent: args.percent,
				standard: args.standard,
			}}"
			?clickable="${args.clickable}"
		></score-subject>`,
	parameters: {
		controls: { exclude: ['freetext', 'allowHtml', 'autoLink'] },
	},
};

/**
 * Sometimes a subject may not have numeric score, such as "award received".
 *
 * The widget support this configuration as well but statistic features are not available
 */
export const Freetext: Story = {
	render: (args) =>
		html`<score-subject
			subject="${args.subject}"
			.data="${{ score: args.freetext }}"
			?clickable="${args.clickable}"
		></score-subject>`,
	args: {
		clickable: false,
	},
	parameters: {
		controls: {
			include: [
				'locale',
				'subject',
				'freetext',
				'clickable',
				'allowHtml',
				'autoLink',
			],
		},
	},
};

export const AllowHTML: Story = {
	render: (args) =>
		html`<score-subject
			subject="${args.subject}"
			.data="${{ score: args.freetext }}"
			?clickable="${args.clickable}"
			?allowhtml="${args.allowHtml}"
			?autolink="${args.autoLink}"
		></score-subject>`,
	args: {
		clickable: false,
		freetext: '<strong>Example</strong>',
		allowHtml: true,
	},
	parameters: {
		controls: {
			include: [
				'locale',
				'subject',
				'freetext',
				'clickable',
				'allowHtml',
				'autoLink',
			],
		},
	},
};

export const AutoLink: Story = {
	render: (args) =>
		html`<score-subject
			subject="${args.subject}"
			.data="${{ score: args.freetext }}"
			?clickable="${args.clickable}"
			?allowhtml="${args.allowHtml}"
			?autolink="${args.autoLink}"
		></score-subject>`,
	args: {
		clickable: false,
		freetext: 'ทดสอบ https://www.example.com ทดสอบ',
		autoLink: true,
	},
	parameters: {
		controls: {
			include: [
				'locale',
				'subject',
				'freetext',
				'clickable',
				'allowHtml',
				'autoLink',
			],
		},
	},
};
