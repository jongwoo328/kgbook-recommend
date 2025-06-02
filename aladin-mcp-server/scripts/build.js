import { build } from 'esbuild';

build({
	entryPoints: ['src/index.ts'],
	outfile: 'dist/index.cjs',
	bundle: true,
	platform: 'node',
	target: 'node22',
	format: 'cjs',
	external: ['path'],
	minify: false,
}).catch(() => process.exit(1));
