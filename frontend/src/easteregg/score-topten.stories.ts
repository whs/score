import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../easteregg/score-topten.ts';

/**
 * The Easter Egg.
 *
 * The story goes:
 *
 * * Designer: "Hey, can we show list the top ten people or is that not allowed?"
 * * ... a few days later ...
 * * Designer: "Show top 10:"
 * * ... a few days later ...
 * * Developer: "Top ten is done"
 * * Designer: "That design is so damn cursed 5555555555"
 * * Developer: "As designed."
 * * Developer: "It almost got a BGM"
 * * Developer: "@Composer can we get a BGM? I'll loop that"
 * * Composer: "Why everyone are so serious about things that are nonfunctional 555"
 *
 * We don't hold copyright to any of the image/audio files in this directory.
 *
 * This component should be usable standalone, but you need to add it directly to `<body>` or portal it out.
 */
const meta: Meta = {
	title: 'score-topten',
	component: 'score-topten',

	render: () => html`<score-topten></score-topten>`,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
