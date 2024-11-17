import type { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
	core: {
		disableTelemetry: true,
	},
	framework: {
		name: '@storybook/web-components-vite',
		options: {},
	},
};
export default config;
