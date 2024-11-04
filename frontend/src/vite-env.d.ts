/// <reference types="vite/client" />

declare module '*.css?inline&lit' {
	const src: import('lit').CSSResult;
	export default src;
}
