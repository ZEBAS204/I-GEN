import { StrictMode, Suspense, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorkerRegistration'

// Redux
import { Provider, useSelector } from 'react-redux'
import store from './redux/store'

import './utils/i18n'
import Logger from './utils/logger'
import { getData } from './utils/appStorage'
import defaultSettings from './utils/defaultSettings'
import defaultThemes from './assets/defaultThemes.json'

import DefaultLayout from './layouts/layout_default'
import {
	ChakraProvider,
	ColorModeScript,
	extendTheme,
	withDefaultColorScheme,
} from '@chakra-ui/react'

/**
 ** DEFAULT THEME OVERRIDE
 ** If you want to set your own custom theme colors, uncomment next line
 ** and the commented line extendTheme inside App()
 */
// import { customTheme } from './utils/theme'

// Set Default User Settings if they are not defined
defaultSettings().then(async () => {
	//Enable Service Worker if user opt in.

	const swEnabled = await getData('opt-in-serviceworker').then(
		(isEnabled) => isEnabled ?? true
	)

	if (swEnabled) {
		Logger.log(['SW', 'info'], 'Registering Service Worker...')
		serviceWorker.register()
	} else {
		Logger.log(['SW', 'info'], 'User opt-out of service worker.')
	}
})

function App() {
	// Allow forcing update from Redux signal
	const dummy = useSelector((state) => state.updateUI.value)

	const [theme, setTheme] = useState('blue')
	const [systemSync, setSystemSync] = useState(false)
	const currentTheme = extendTheme(
		extendTheme({
			//* Uncomment next line for theme override
			// ...customTheme,
			config: {
				initialColorMode: 'dark',
				useSystemColorMode: systemSync,
			},
		}),
		withDefaultColorScheme({ colorScheme: theme })
	)

	useEffect(() => {
		;(async () => {
			await getData('useSystemColorMode').then((sync) => {
				if (sync && typeof sync === 'boolean') {
					Logger.log(['APP', 'info'], `Is using system color mode?: ${sync}`)
					setSystemSync(sync)
				}
			})
		})()
	}, [])

	useEffect(() => {
		;(async () => {
			await getData('colorScheme').then((theme) => {
				//* Default themes: https://chakra-ui.com/docs/theming/theme
				if (
					theme &&
					typeof theme === 'string' &&
					defaultThemes.includes(theme)
				) {
					Logger.log(['APP', 'info'], `Theme: ${theme}`)
					setTheme(theme)
				}
			})
		})()
	}, [dummy])

	return (
		<>
			<ColorModeScript initialColorMode={'dark'} />
			<ChakraProvider resetCSS theme={currentTheme}>
				<DefaultLayout />
			</ChakraProvider>
		</>
	)
}

// Change document title if in dev environment
if (process.env.NODE_ENV === 'development')
	document.title = '[DEV] ' + document.title

// <React.Suspense> allows asynchronously load translations using backend
// but will increase a tiny the loading time..
ReactDOM.render(
	<StrictMode>
		<Suspense fallback={<></>}>
			<Provider store={store}>
				<App />
			</Provider>
		</Suspense>
	</StrictMode>,
	document.getElementById('root')
)
