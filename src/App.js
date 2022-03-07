import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import './utils/i18n'
import Logger from './utils/logger'
import { getData } from './utils/appStorage'

import {
	ChakraProvider,
	ColorModeScript,
	extendTheme,
	withDefaultColorScheme,
} from '@chakra-ui/react'

import DefaultLayout from './layouts/layout_default'
import defaultThemes from './assets/defaultThemes.json'
import UpdateNotification from './components/UpdateNotification'

/**
 ** DEFAULT THEME OVERRIDE
 ** If you want to set your own custom theme colors, uncomment the next import
 ** and the commented line inside extendTheme
 */
// import { customTheme } from './utils/theme'

export default function App({ swUpdate, registration }) {
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
			<ColorModeScript initialColorMode="dark" />
			<ChakraProvider resetCSS theme={currentTheme}>
				{swUpdate && <UpdateNotification registration={registration} />}
				<DefaultLayout />
			</ChakraProvider>
		</>
	)
}
