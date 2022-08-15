import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpApi from 'i18next-http-backend'

// Supported Languages. Separated file so can be used in settings page to get all languages
import { supportedLanguages } from './supportedLanguages'

// shortband for if-else later
const dev = import.meta.MODE === 'development'

i18n
	.use(HttpApi)
	// detect user language
	// learn more: https://github.com/i18next/i18next-browser-languageDetector
	.use(LanguageDetector)
	// pass the i18n instance to react-i18next.
	.use(initReactI18next)
	// init i18next
	.init({
		// Enable debug mode if in development mode environment
		debug: dev,

		// Do not use locates country codes (eg. en-CA)
		load: 'languageOnly',

		// Language to use if translations are not available
		fallbackLng: 'en',

		// Allows (eg."en-US" and "en-UK") to be implicitly supported when "en"
		nonExplicitSupportedLngs: true,

		// Locales will be fully lowercased
		lowerCaseLng: true,

		// Overwrite defaults and order from where language should be detected
		detection: {
			lookupQuerystring: 'lang', // default is lng
			order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
			caches: ['localStorage'],
		},

		// Add supported languages from ./supportedLanguages
		supportedLngs: supportedLanguages.map((lang) => lang.code),

		// Back-end path. Will be used in release to asynchronously load translations
		// eg. www.example.com/locates/es.json
		backend: {
			// {{lng}} = language = en / es
			// {{ns}} = translation = translation.json
			// {{lng}}/{{ns}}.json = /en/translation.json
			loadPath: '/locales/{{lng}}.json',
			allowMultiLoading: false,
		},

		keySeparator: '.', // Allow nesting keys with dots (def dot)
		interpolation: {
			escapeValue: false, // Not needed for react as it escapes by default
		},
	})
// for all options read: https://www.i18next.com/overview/configuration-options
