import React from 'react'
import ReactDOM from 'react-dom'
// Redux
import { Provider } from 'react-redux'
import store from './redux/store'

import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'

import * as serviceWorker from './serviceWorkerRegistration'
import Logger from './utils/logger'

import defaultSettings from './utils/defaultSettings' // Default Configuration
import { getData } from './utils/appStorage' // UserSettings data

// Translations
import './utils/i18n'

// Import Electron OS Menu Bar
import OS_MENU_BAR from './components/OS_Bar'

// Import Default Page Layout
import DefaultLayout from './layouts/layout_default'

const theme = extendTheme({
	config: {
		initialColorMode: 'dark',
		// FIXME: fix not using user prefer color mode
		useSystemColorMode: false, //! Ignores saved user config
	},
})

// Set Default User Settings if they are not defined
defaultSettings().then(() => {
	//Enable Service Worker if user opt in.
	if ('serviceWorker' in navigator) {
		// If you want your app to work offline and load faster, you can change
		// unregister() to register() below. Note this comes with some pitfalls.
		// Learn more about service workers:
		// https://github.com/facebook/create-react-app/blob/master/packages/cra-template/template/README.md
		let swEnabled = getData('opt-in-serviceworker')
		if (swEnabled === null) {
			swEnabled = true
		}

		if (swEnabled) {
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
			<Provider store={store}>
				<ColorModeScript initialColorMode={theme.config.initialColorMode} />
				<ChakraProvider resetCSS theme={theme}>
					<OS_MENU_BAR />
					<DefaultLayout />
				</ChakraProvider>
			</Provider>
		</React.Suspense>
	</React.StrictMode>,
	document.getElementById('root')
)
