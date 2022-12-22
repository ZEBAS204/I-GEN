import { getManifestDescription } from './viteServiceWorker'

import { supportedLanguages } from '../src/utils/supportedLanguages'

/**
 * Build all HTML alternate URLs for all supported languages to redirect when browsing in a search engine
 */
const getSupportedLanguages = () => {
	return supportedLanguages.map((lang) => ({
		injectTo: 'head',
		tag: 'link',
		attrs: {
			rel: 'alternate',
			href: `/?lang=${lang.code}`,
			hreflang: lang.code,
		},
	}))
}

/**
 * All head metadata to be used with vite-plugin-html
 */
export const headMetadata = () => [
	{
		injectTo: 'head',
		tag: 'meta',
		attrs: {
			name: 'description',
			content: getManifestDescription(),
		},
	},
	{
		injectTo: 'head',
		tag: 'meta',
		attrs: {
			name: 'keywords',
			content:
				'word, words, writing, keyword, random, generator, random word generator, random word, random generator, word generator, noun, nouns, adjective, adjectives',
		},
	},
	...getSupportedLanguages(),
]
