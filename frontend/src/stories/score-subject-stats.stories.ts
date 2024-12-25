import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../score-subject-stats.ts';
import { action } from '@storybook/addon-actions';
import { ScoreSubjectStats, SubjectScore } from '../schema.ts';
import { TopTenMode } from '../score-subject-stats.ts';

const meta: Meta = {
	title: 'score-subject-stats',
	component: 'score-subject-stats',
	args: {
		subject: 'ชื่อวิชา',
		score: 10,
		fullScore: 50,
		rank: 1,
		topten: TopTenMode.TOP_TEN,
		standard: 1,
		count: 1000,
		hiscore: 50,
		hiscore_cnt: 10,
		lowscore: 0,
		lowscore_cnt: 50,
		lowscore2: 1,
		lowscore2_cnt: 20,
		mode: 22,
		mode_cnt: 100,
		average: 20,
	},
	argTypes: {
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
		topten: {
			description: 'Activate Easter Egg',
			control: {
				type: 'select',
				labels: Object.keys(TopTenMode),
			},
			options: Object.values(TopTenMode),
		},
		count: {
			description: 'No. of examinee',
			control: {
				min: 1,
			},
		},
		hiscore: {
			description: 'Highest score achieved',
			control: {
				min: 0,
			},
		},
		hiscore_cnt: {
			description: 'No. of people who has the highest score',
			control: {
				min: 1,
			},
		},
		lowscore: {
			description: 'Lowest score achieved',
			control: {
				min: 0,
			},
		},
		lowscore_cnt: {
			description: 'No. of people who has the lowest score',
			control: {
				min: 1,
			},
		},
		lowscore2: {
			description: '2nd Lowest score achieved',
			control: {
				min: 1,
			},
		},
		lowscore2_cnt: {
			description: 'No. of people who has the 2nd lowest score',
			control: {
				min: 1,
			},
		},
		mode: {
			control: {
				min: 0,
			},
		},
		mode_cnt: {
			description: 'No. of people who has the most common score',
			control: {
				min: 1,
			},
		},
		average: {
			description: 'Average score',
			control: {
				min: 0,
				step: 0.01,
			},
		},
	},
};

export default meta;
type Story = StoryObj;

function fakeDataFromArgs(args: Args): SubjectScore {
	return {
		score: args.score,
		rank: args.rank,
		percent: (args.score / args.fullScore) * 100,
		standard: args.standard,
	};
}

function fakeHistogramFromArgs(args: Args): number[] {
	let out = [];

	for (let i = 0; i <= args.fullScore; i++) {
		out.push(0);
	}

	out[args.hiscore] = args.hiscore_cnt;
	out[args.lowscore] = args.lowscore_cnt;
	out[args.lowscore2] = args.lowscore_cnt2;
	out[args.mode] = args.mode_cnt;

	if (out[args.score] === 0) {
		out[args.score]++;
	}

	return out;
}

function fakeStatsFromArgs(args: Args): ScoreSubjectStats {
	return {
		histogram: fakeHistogramFromArgs(args),
		max: args.fullScore,
		name: args.subject,
		count: args.count,
		hiscore: args.hiscore,
		hiscore_cnt: args.hiscore_cnt,
		lowscore: args.lowscore,
		lowscore_cnt: args.lowscore_cnt,
		lowscore2: args.lowscore2,
		lowscore2_cnt: args.lowscore2_cnt,
		mode: args.mode,
		mode_cnt: args.mode_cnt,
		average: args.average,
		sd: args.standard,
	};
}

export const Default: Story = {
	render: (args) =>
		html` <score-subject-stats
			subject="${args.subject}"
			.score="${fakeDataFromArgs(args)}"
			.stats="${fakeStatsFromArgs(args)}"
			.topten="${args.topten}"
			@close="${action('close')}"
		></score-subject-stats>`,
};

/**
 * The component can be rendered without histogram
 */
export const NoHistogram: Story = {
	render: (args) =>
		html` <score-subject-stats
			subject="${args.subject}"
			.score="${fakeDataFromArgs(args)}"
			.stats="${fakeStatsFromArgs(args)}"
			.topten="${args.topten}"
			nohistogram
			@close="${action('close')}"
		></score-subject-stats>`,
};
