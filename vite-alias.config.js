import { resolve } from 'path'

/*
 * To maintain consistency between the relative paths
 * used in the vite.config.js and vitest.config.js files.
 * We export a single alias that both files can use.
 */
export const alias = () => {
	return {
		'@/': resolve(__dirname, '.'),
		'@src': resolve(__dirname, 'src'),
		'@assets': resolve(__dirname, 'src/assets'),
		'@styles': resolve(__dirname, 'src/assets/scss'),
		'@components': resolve(__dirname, 'src/components'),
		'@layouts': resolve(__dirname, 'src/layouts'),
		'@pages': resolve(__dirname, 'src/pages'),
		'@utils': resolve(__dirname, 'src/utils'),
		'@contexts': resolve(__dirname, 'src/components/contexts'),
	}
}
