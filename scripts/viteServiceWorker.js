import { resolve } from 'path'

const APP_NAME = 'I-GEN'

/**
 * To avoid handling duplicated project descriptions, we directly parse the
 * i18n English location file from the static directory and extract the
 * description (`about.desc`) of the app to use on the PWA manifest.
 * @returns {string}
 */
export const getManifestDescription = () => {
	const path = resolve(__dirname, '../src/static/locales')
	const locates = require(`${path}/en.json`)

	// Include any variable used in the i18n locale string
	const locateVars = {
		app_name: APP_NAME,
	}

	const description = locates?.about?.desc

	if (!description) {
		console.error(`No description found`)
		return '?'
	}

	// Parse description
	return description
		.replace(/<.+?>/gim, '') // Replace any html element
		.replace(/\{\{(.+?)\}\}/gim, (match, p1) => {
			// Replace i18n variables
			// Keep match if not key was found
			return locateVars[p1] || match
		})
}

/** @type {import('vite-plugin-pwa').VitePWAOptions} */
export const viteServiceWorker = {
	registerType: 'prompt', // We use the virtual register mode to allow the user to manually update when desired
	devOptions: {
		//* Enable when needed, if not you'l have to manually remove cache when working
		//* Note: some fonts will not load correctly
		enabled: false,
	},
	workbox: {
		sourcemap: true, // Sourcemap will be generated when Vite's sourcemap is enabled

		clientsClaim: true, // Needed for offline usage
		skipWaiting: true, // Allow to trigger cache reload manually
		globPatterns: ['**/*.{js,css,scss,html}'],
		runtimeCaching: [
			{
				urlPattern: ({ url }) => url.pathname.startsWith('/locales/'),
				handler: 'CacheFirst',
				options: {
					cacheName: 'locales',
					expiration: {
						// Will only save the 2 last used locales, saving more
						// than two locales is unnecessary for the normal user
						maxEntries: 2,
					},
				},
			},
			{
				urlPattern: ({ url }) => url.pathname.startsWith('/wordsets/'),
				handler: 'CacheFirst',
				options: {
					cacheName: 'wordsets',
					expiration: {
						// As the wordsets size is huge and no user will manually remove it
						// from the cache, only save the last used noun and adjective
						maxEntries: 2,
					},
				},
			},
		],
	},
	includeAssets: [
		// We need to include all other assets.
		// If not, for some reason they will not be accessible.
		'robots.txt',
		'favicon.ico',
		'apple-touch-icon.png',
	],
	manifest: {
		appName: APP_NAME,
		name: APP_NAME,
		description: getManifestDescription(),
		dir: 'ltr',
		lang: 'en',
		display: 'standalone',
		start_url: '/?source=pwa',
		appleStatusBarStyle: 'black-translucent',
		theme_color: '#6c36dd',
		background_color: '#6c36dd',
		icons: [
			{
				src: 'android-chrome-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: 'android-chrome-512x512.png',
				sizes: '512x512',
				type: 'image/png',
			},
		],
	},
}
