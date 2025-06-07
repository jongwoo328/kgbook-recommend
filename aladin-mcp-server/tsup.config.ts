import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	outDir: 'dist',
	target: 'node22',
	format: ['esm'],
	clean: true,
	sourcemap: true,
	dts: false,
	splitting: false,
	minify: false,
});
