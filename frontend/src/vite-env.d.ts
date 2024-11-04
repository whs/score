/// <reference types="vite/client" />
/// <reference types="vite-plugin-data-url/types" />

declare module '*.css?inline&lit' {
	const src: import('lit').CSSResult;
	export default src;
}
