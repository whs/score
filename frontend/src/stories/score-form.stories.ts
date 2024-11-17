import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../score-form.ts';
import { FileState, FileList } from '../schema.ts';
import { action } from '@storybook/addon-actions';

const meta: Meta = {
	title: 'score-form',
	component: 'score-form',
	args: {
		usernameInputMode: 'numeric',
		passwordInputMode: 'numeric',
	},
	argTypes: {
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
};

export default meta;
type Story = StoryObj;

const fileList: FileList = {
	file1: {
		id: 'file1',
		name: 'File 1 (incomplete)',
		uploaded: FileState.IN_PROGRESS_1,
	},
	file2: {
		id: 'file2',
		name: 'File 2',
		uploaded: FileState.COMPLETE,
	},
	file3: {
		id: 'file3',
		name: 'File 3',
		uploaded: FileState.COMPLETE,
	},
};

export const Default: Story = {
	render: (args) =>
		html`<score-form
			usernameInputMode="${args.usernameInputMode}"
			passwordInputMode="${args.passwordInputMode}"
			.fileList="${Promise.resolve(fileList)}"
			@submit="${action('submit')}"
		></score-form>`,
};

/**
 * Initially the file list may not be ready. This disable the form submission
 */
export const Loading: Story = {
	render: () => html`<score-form></score-form>`,
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
 * There are multiple slots available to override the fields externally
 *
 * Note that by using slot, users must manually localize the overriden texts
 */
export const Slots: Story = {
	render: (args) =>
		html`<score-form
			usernameInputMode="${args.usernameInputMode}"
			passwordInputMode="${args.passwordInputMode}"
			.fileList="${Promise.resolve(fileList)}"
			@submit="${action('submit')}"
		>
			${slotExample('header')} ${slotExample('header-in')}
			${slotExample('username')} ${slotExample('password')}
			${slotExample('beforefilelist')} ${slotExample('beforesubmit')}
			${slotExample('footer')}
		</score-form>`,
};
