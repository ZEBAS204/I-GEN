import { readFile } from 'fs/promises'
import { resolve } from 'path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'
import { ViteWebfontDownload } from 'vite-plugin-webfont-dl'
import { createHtmlPlugin } from 'vite-plugin-html'
import { VitePWA } from 'vite-plugin-pwa'

// Custom build scripts
import {
	getGitRevision,
	getGitBranch,
	headMetadata,
	viteServiceWorker,
} from './scripts'

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
	root: './',
	build: {
		outDir: 'build',
	},
	publicDir: './src/static',
	define: {
		// See: https://github.com/revoltchat/revite/blob/master/vite.config.ts
		__GIT_REVISION__: JSON.stringify(getGitRevision()),
		__GIT_BRANCH__: JSON.stringify(getGitBranch()),
		__PROJECT_SOURCE__: JSON.stringify('#'), //TODO: replace with project source repository
	},

	plugins: [
		react(),
		svgrPlugin({
			svgrOptions: {
				icon: true,
			},
		}),
		ViteWebfontDownload([
			'https://fonts.googleapis.com/css2?family=Inter:wght@600;700',
			'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700',
		]),
		createHtmlPlugin({
			verbose: true,
			minify: true,
			/**
			 * After writing entry here, you will not need to add script tags in `index.html`, the original tags need to be deleted
			 * @default src/main.ts
			 */
			entry: 'src/index.jsx',
			/**
			 * If you want to store `index.html` in the specified folder, you can modify it, otherwise no configuration is required
			 * @default index.html
			 */
			template: 'index.html',

			inject: {
				data: {
					title: 'I-GEN',
				},
				tags: [...headMetadata()],
			},
		}),
		VitePWA(viteServiceWorker),
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
			'@contexts': resolve(__dirname, 'src/components/contexts'),
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
							contents: await readFile(args.path, 'utf8'),
						}))
					},
				},
			],
		},
	},
})
