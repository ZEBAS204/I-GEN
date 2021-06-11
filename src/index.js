import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorkerRegistration'
import Logger from './utils/logger'

import {
	ChakraProvider, // Chakra UI Context
	ColorModeScript, // Chakra UI Easy theme swap
	extendTheme, // Chakra UI Theme
} from '@chakra-ui/react'

import defaultSettings from './utils/defaultSettings' // Default Configuration
import { getData } from './utils/appStorage' // UserSettings data

// Translations
import './utils/i18n'

// Import Electron OS Menu Bar
import OS_MENU_BAR from './components/OS_Bar'

// Import Default Page Layout
import DefaultLayout from './layouts/default'

const theme = extendTheme({
	config: {
		initialColorMode: 'dark',
		// TODO: fix not using user prefer color mode
		useSystemColorMode: false, //! Ignores saved user config
	},
})

// Set Default User Settings if they are not defined
defaultSettings().then(async () => {
	//Enable Service Worker if user opt in.
	if ('serviceWorker' in navigator) {
		// If you want your app to work offline and load faster, you can change
		// unregister() to register() below. Note this comes with some pitfalls.
		// Learn more about service workers:
		// https://github.com/facebook/create-react-app/blob/master/packages/cra-template/template/README.md
		if (await getData('opt-in-serviceworker')) {
			Logger.log(['SW', 'info'], 'Registering Service Worker...')
			try {
				// Will not register in dev environment
				serviceWorker.register()
			} catch (err) {
				Logger.log(['SW', 'error'], err)
			}
		} else {
			Logger.log(['SW', 'info'], 'User opt-out of service worker.')
		}
	} else {
		Logger.log(['SW', 'warn'], 'Service Workers not supported by the browser')
	}
})

// <React.Suspense> allows asynchronously load translations using backend
// but will increase a tiny the loading time..
ReactDOM.render(
	<React.StrictMode>
		<React.Suspense fallback="">
			<ColorModeScript initialColorMode={theme.config.initialColorMode} />
			<ChakraProvider resetCSS theme={theme}>
				<OS_MENU_BAR />
				<DefaultLayout />
			</ChakraProvider>
		</React.Suspense>
	</React.StrictMode>,
	document.getElementById('root')
)
