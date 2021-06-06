import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpApi from 'i18next-http-backend'

// Supported Languages
import { supportedLanguages } from './supportedLanguages'

// shortband for if-else later
const dev = process.env.NODE_ENV === 'development'

// Registering the back-end plugin
// Will allow asynchronous load of translations
const backendEnabled = dev ? i18n : i18n.use(HttpApi)

backendEnabled
	// detect user language
	// learn more: https://github.com/i18next/i18next-browser-languageDetector
	.use(LanguageDetector)
	// pass the i18n instance to react-i18next.
	.use(initReactI18next)
	// init i18next
	.init({
		// Enable debug mode if in development mode environment
		debug: dev,

		// Language to use if translations are not available
		fallbackLng: 'en',

		// Allows (eg."en-US" and "en-UK") to be implicitly supported when "en"
		nonExplicitSupportedLngs: true,

		// Overwrite defaults order from where language should be detected
		order: [
			'localStorage',
			'sessionStorage',
			'cookie', //! This project uses no cookies
			'querystring',
			'navigator',
			'htmlTag',
		],

		// Add supported languages from ./supportedLanguages
		supportedLngs: supportedLanguages.map((lang) => lang.code),

		// Resources are defined only for development
		// On releases, will use backend defined path bellow
		resources: dev
			? {
					en: {
						translation: require('../static/locales/en.json'),
					},
					es: {
						translation: require('../static/locales/es.json'),
					},
			  }
			: undefined,

		// Back-end path. Will be used in release to asynchronously load translations
		// eg. www.example.com/locates/es.json
		backend: dev
			? undefined
			: {
					// {{lng}} = language = en / es
					// {{ns}} = translation = translation.json
					// {{lng}}/{{ns}}.json = /en/translation.json
					loadPath: '/locales/{{lng}}.json',
			  },

		keySeparator: '.', // Allow nesting keys with dots (def dot)
		interpolation: {
			escapeValue: false, // Not needed for react as it escapes by default
		},
	})
// for all options read: https://www.i18next.com/overview/configuration-options
