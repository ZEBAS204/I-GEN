import { readFile, readFileSync } from 'fs'
import { resolve } from 'path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'
import progress from 'vite-plugin-progress'
import { ViteWebfontDownload } from 'vite-plugin-webfont-dl'

const getGitRevision = () => {
	try {
		const rev = readFileSync('.git/HEAD').toString().trim()
		if (rev.indexOf(':') === -1) {
			return rev
		}

		return readFileSync(`.git/${rev.substring(5)}`)
			.toString()
			.trim()
			.slice(0, 7)
	} catch (err) {
		console.error('Failed to get Git revision.', err)
		return '?'
	}
}

const getGitBranch = () => {
	try {
		const rev = readFileSync('.git/HEAD').toString().trim()
		if (rev.indexOf(':') === -1) {
			return 'DETACHED'
		}

		return rev.split('/').pop()
	} catch (err) {
		console.error('Failed to get Git branch.', err)
		return '?'
	}
}

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
		progress(),
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
