import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	outDir: 'dist',
	target: 'node22',
	format: ['cjs'],
	clean: true,
	sourcemap: true,
	bundle: true,
	dts: false,
	splitting: false,
	minify: false,
	noExternal: [/./],
});
