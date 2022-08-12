import { resolve } from 'path'
import fs from 'fs/promises'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
	root: './',
	build: {
		outDir: 'build',
	},
	publicDir: './src/static',

	plugins: [
		react(),
		svgrPlugin({
			svgrOptions: {
				icon: true,
			},
		}),
	],
	resolve: {
		alias: {
			'@/': resolve(__dirname, '.'),
			'@src': resolve(__dirname, 'src'),
			'@assets': resolve(__dirname, 'src/assets'),
			'@styles': resolve(__dirname, 'src/assets/scss'),
			'@components': resolve(__dirname, 'src/components'),
			'@layouts': resolve(__dirname, 'src/layouts'),
			'@pages': resolve(__dirname, 'src/pages'),
			'@utils': resolve(__dirname, 'src/utils'),
		},
	},
	//* Handle JS files with JSX syntax
	esbuild: {
		loader: 'jsx',
		include: /src\/.*\.jsx?$/,
		exclude: [],
	},
	optimizeDeps: {
		include: [],
		esbuildOptions: {
			plugins: [
				{
					name: 'load-js-files-as-jsx',
					setup(build) {
						build.onLoad({ filter: /src\\.*\.js$/ }, async (args) => ({
							loader: 'jsx',
							contents: await fs.readFile(args.path, 'utf8'),
						}))
					},
				},
			],
		},
	},
})
