import type { Preview } from '@storybook/web-components';
import '../src/score-font';
import { html } from 'lit';
import {
	sourceLocale,
	targetLocales,
	allLocales,
} from '../src/generated/locale-codes.ts';
import { configureLocalization } from '@lit/localize';

const { setLocale } = configureLocalization({
	sourceLocale,
	targetLocales,
	loadLocale: async (locale) => import(`../src/generated/locales/${locale}.ts`),
});

const preview: Preview = {
	tags: ['autodocs'],
	parameters: {
		backgrounds: {
			values: [
				{ name: 'Default', value: '#ecf0f5' },
				{ name: 'White', value: 'white' },
				{ name: 'Black', value: 'black' },
			],
			default: 'Default',
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
	args: {
		locale: 'th',
	},
	argTypes: {
		locale: {
			description: 'Language',
			options: allLocales,
			control: 'inline-radio',
		},
	},
	decorators: [
		(story) => html`<score-font></score-font>${story()}`,
		(story, ctx) => {
			setLocale(ctx.args.locale);
			return story();
		},
	],
};

export default preview;
