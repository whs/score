import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../score-share.ts';
import { fakeDataFromArgs, fakeStatsFromArgs } from './score-result.stories.ts';

/**
 * score-share generate a saveable-image of the share
 */
const meta: Meta = {
	title: 'Component/score-share',
	component: 'score-share',
	args: {
		name: 'มาร์ตี้ แมคเฟค Marty McFake',
		fname: 'ไฟล์ทดสอบ Test File',
		subject: 'ชื่อวิชา',
		score: 10,
		fullScore: 50,
		rank: 1,
		standard: 1,
		fixedString: 'Arbitrary string',
	},
	argTypes: {
		name: {
			description: 'Name of student',
			control: 'text',
		},
		fname: {
			description: 'Filename',
			control: 'text',
		},
		score: {
			control: {
				type: 'number',
				min: 0,
			},
		},
		fullScore: {
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
		standard: {
			description: 'Standard Deviation. Currently unused',
			control: {
				type: 'number',
				min: 0,
				step: 0.01,
			},
		},
	},
};

export default meta;
type Story = StoryObj;

export const Share: Story = {
	render: (args) =>
		html`<score-share
			.data="${fakeDataFromArgs(args, 5)}"
			.stats="${fakeStatsFromArgs(args)}"
		></score-share>`,
	parameters: {
		controls: { exclude: ['freetext'] },
	},
};
