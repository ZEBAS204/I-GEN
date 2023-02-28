import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative alias
import { alias } from './vite-alias.config'

const empty = () => '""'

export default defineConfig({
	plugins: [react()],
	define: {
		__GIT_REVISION__: empty(),
		__GIT_BRANCH__: empty(),
		__PROJECT_SOURCE__: empty(),
		__CONTRIBUTE_TRANSLATION__: empty(),
	},
	test: {
		globals: true,
		environment: 'jsdom',
		include: ['./src/__tests__/**/*.test.{js,jsx}'],
		setupFiles: './src/__tests__/setup-tests.js',
		coverage: {
			reportsDirectory: './src/__tests__/coverage',
			// provider: 'c8', // or istanbul
		},
	},
	resolve: {
		alias: alias(),
	},
})
