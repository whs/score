import type { UserConfig } from 'vite';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import license from 'rollup-plugin-license';
import symfony from 'vite-plugin-symfony';
import * as path from 'node:path';

export default {
	appType: 'mpa',
	base: '',
	build: {
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, 'index.html'),
				adminCSS: './node_modules/@picocss/pico/css/pico.min.css',
			},
		},
		outDir: 'dist',
		manifest: true,
		assetsInlineLimit: (filePath, _content) => {
			// Force the eastereggs to use data URL
			if (filePath.match(/easteregg\/(.*?)\.(webp|mp4)$/)) {
				return true;
			}
		},
	},
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
		// @ts-ignore https://github.com/asyncLiz/rollup-plugin-minify-html-literals/issues/24
		minifyHTML.default(),
		symfony(),
	],
	optimizeDeps: {
		force: true,
	},
	server: {
		host: '127.0.0.1',
	},
} satisfies UserConfig;
