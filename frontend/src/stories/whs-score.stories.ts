import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../whs-score.ts';
import { styleMap } from 'lit/directives/style-map.js';

/**
 * whs-score is the entrypoint to the application. To use it, simply
 * add a `<whs-score></whs-score>` to the page.
 *
 * By default, the widget only allow numeric username and password to be entered using a virtual keyboard.
 * This can be changed by changing the `usernameInputMode` and `passwordInputMode` attributes respectively.
 */
const meta: Meta = {
	title: 'whs-score',
	component: 'whs-score',
	args: {
		topten: false,
		usernameInputMode: 'numeric',
		passwordInputMode: 'numeric',
	},
	argTypes: {
		topten: {
			description: 'Activate Easter Egg',
		},
		usernameInputMode: {
			control: 'select',
			description:
				'Input mode of the username field. This affect on screen keyboards and do not actually block inputs from other types',
			options: [
				'none',
				'text',
				'decimal',
				'numeric',
				'tel',
				'search',
				'email',
				'url',
			],
		},
		passwordInputMode: {
			control: 'select',
			description:
				'Input mode of the password field. This affect on screen keyboards and do not actually block inputs from other types',
			options: ['none', 'text', 'decimal', 'numeric'],
		},
	},

	render: (args) =>
		html`<whs-score
			usernameInputMode="${args.usernameInputMode}"
			passwordInputMode="${args.passwordInputMode}"
			?topten="${args.topten}"
		></whs-score>`,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

function slotExample(name: string) {
	return html`<div
		slot="${name}"
		style="text-align: center; border: black dashed 1px;"
	>
		Slot ${name}
	</div>`;
}

/**
 * There are multiple slots available to override the fields externally
 *
 * Note that by using slot, users must manually localize the overriden texts
 *
 * Additionally there is also slot `beforescore-xxx` and `afterscore-xxx` where xxx refers to the file ID.
 */
export const Slot: Story = {
	render: (args) =>
		html`<whs-score
			usernameInputMode="${args.usernameInputMode}"
			passwordInputMode="${args.passwordInputMode}"
		>
			${slotExample('header')} ${slotExample('header-in')}
			${slotExample('username')} ${slotExample('password')}
			${slotExample('beforefilelist')} ${slotExample('beforesubmit')}
			${slotExample('footer')} ${slotExample('beforescore')}
			${slotExample('afterscore')}
		</whs-score>`,
};

/**
 * The component is designed to be usable as part of other web pages
 */
export const WebPage: Story = {
	render: (args) => html`
		<h1>School website</h1>
		<p>Students can view their score in this widget. This is not an frame</p>
		<div
			id="widget"
			style="${styleMap({
				width: `${args.width}px`,
				height: args.height ? `${args.height}px` : 'auto',
				overflow: args.overflow,
				margin: 'auto',
			})}"
		>
			<whs-score
				usernameInputMode="${args.usernameInputMode}"
				passwordInputMode="${args.passwordInputMode}"
				?topten="${args.topten}"
			></whs-score>
		</div>
		<p>Thank you for visiting</p>
	`,
	args: {
		width: 800,
		height: 0,
		overflow: 'visible',
	},
	argTypes: {
		width: {
			control: {
				type: 'range',
				min: 600,
				max: 1280,
			},
		},
		height: {
			control: {
				type: 'range',
				min: 0,
				max: 720,
			},
		},
		overflow: {
			options: ['visible', 'scroll', 'auto', 'hidden'],
			control: 'select',
		},
	},
	parameters: {
		background: {
			default: 'White',
		},
	},
};
