import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../score-result.ts';
import { action } from '@storybook/addon-actions';
import { ScoreStats, UserScore } from '../schema.ts';

const meta: Meta = {
	title: 'score-result',
	component: 'score-result',
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

function fakeDataFromArgs(args: Args, amount = 0): UserScore {
	const out: UserScore = {
		_name: args.name,
		_fname: args.fname,
		[`${args.subject} (${args.fullScore})`]: {
			score: args.score,
			rank: args.rank,
			percent: (args.score / args.fullScore) * 100,
			standard: args.standard,
		},
		[args.subject]: args.fixedString,
	};

	for (let i = 0; i < amount; i++) {
		let fullScore = Math.round(Math.random() * 1_000_000);
		let score = Math.round(Math.random() * fullScore);
		out[`Random ${i + 1} (${fullScore})`] = {
			score,
			percent: (score / fullScore) * 100,
			rank: Math.round(Math.random() * 1_000),
			standard: Math.random() * 5,
		};
	}

	return out;
}

function fakeStatsFromArgs(args: Args): ScoreStats {
	return {
		[`${args.subject} (${args.fullScore})`]: {
			histogram: [],
			max: args.fullScore,
			name: args.subject,
			count: 10,
			hiscore: args.fullScore,
			hiscore_cnt: 10,
			lowscore: 0,
			lowscore_cnt: 0,
			lowscore2: 0,
			lowscore2_cnt: 0,
			mode: 0,
			mode_cnt: 10,
			average: args.fullScore / 2,
			sd: args.standard,
		},
	};
}

export const Default: Story = {
	render: (args) =>
		html`<score-result
			.data="${fakeDataFromArgs(args, 5)}"
			.stats="${Promise.resolve(fakeStatsFromArgs(args))}"
			@close="${action('close')}"
			@stats="${action('stats')}"
		></score-result>`,
};

/**
 * The data file do not store max score.
 * So without stats file the max score is derived on the client side.
 */
export const LoadingStats: Story = {
	render: (args) =>
		html`<score-result
			.data="${fakeDataFromArgs(args)}"
			@close="${action('close')}"
			@stats="${action('stats')}"
		></score-result>`,
};

function slotExample(name: string) {
	return html`<div
		slot="${name}"
		style="text-align: center; border: black dashed 1px;"
	>
		Slot ${name}
	</div>`;
}

/**
 * There are slots available to override the fields externally
 *
 * Note that by using slot, users must manually localize the overriden texts
 */
export const Slot: Story = {
	render: (args) =>
		html`<score-result
			.data="${fakeDataFromArgs(args)}"
			.stats="${Promise.resolve(fakeStatsFromArgs(args))}"
			@close="${action('close')}"
			@stats="${action('stats')}"
		>
			${slotExample('beforescore')} ${slotExample('afterscore')}
		</score-result>`,
};
