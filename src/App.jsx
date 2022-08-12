import { useState, useEffect } from 'react'
import {
	ChakraProvider,
	ColorModeScript,
	extendTheme,
	withDefaultColorScheme,
} from '@chakra-ui/react'
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui'

import './utils/i18n'
import { getData } from './utils/appStorage'
import Logger from './utils/logger'
import DefaultLayout from './layouts/layout_default'
import UpdateNotification from './components/UpdateNotification'

/**
 ** DEFAULT THEME OVERRIDE
 ** If you want to set your own custom theme colors, uncomment the next import
 ** and the commented line inside extendTheme
 */
import { customTheme } from './utils/theme'

export default function App({ swUpdate, registration }) {
	const [systemSync, setSystemSync] = useState(false)

	const currentTheme = extendTheme(
		extendTheme({
			//* Uncomment next line for theme override
			...customTheme,
			config: {
				initialColorMode: 'dark',
				useSystemColorMode: systemSync,
			},
		}),
		withDefaultColorScheme({ colorScheme: 'blue' })
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

	return (
		<>
			<ColorModeScript initialColorMode="dark" />
			<ChakraProvider resetCSS theme={currentTheme}>
				<ThemeEditorProvider>
					{swUpdate && <UpdateNotification registration={registration} />}
					<DefaultLayout />
				</ThemeEditorProvider>
			</ChakraProvider>
		</>
	)
}
