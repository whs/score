import type { UserConfig } from 'vite'
import minifyHTML from 'rollup-plugin-minify-html-literals';
import license from 'rollup-plugin-license';
import * as path from "node:path";

export default {
	appType: 'mpa',
	esbuild: {
		banner: '/*! licenses: vendor.LICENSE.txt */',
		legalComments: 'none',
	},
	plugins: [
		license({
			thirdParty: {
				includeSelf: true,
				output: path.resolve(__dirname, 'dist/assets/vendor.LICENSE.txt'),
			},
		}),
		minifyHTML.default(), //ts-ignore https://github.com/asyncLiz/rollup-plugin-minify-html-literals/issues/24
	],
} satisfies UserConfig