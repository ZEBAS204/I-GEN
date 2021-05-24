import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
	// detect user language
	// learn more: https://github.com/i18next/i18next-browser-languageDetector
	.use(LanguageDetector)
	// pass the i18n instance to react-i18next.
	.use(initReactI18next)
	// init i18next
	.init({
		debug: false, // Logs info level to console output
		fallbackLng: 'en-us', // Language to use if translations are not available
		order: [
			// Overwrite defaults order from where language should be detected
			'localStorage',
			'sessionStorage',
			'cookie', //! This project uses no cookies
			'querystring',
			'navigator',
			'htmlTag',
		],
		resources: {
			'en-us': {
				translation: require('../static/locales/en-us.json'),
			},
			'es-es': {
				translation: require('../static/locales/es-es.json'),
			},
		},
		interpolation: {
			escapeValue: false, // not needed for react as it escapes by default
		},
	})
// for all options read: https://www.i18next.com/overview/configuration-options
