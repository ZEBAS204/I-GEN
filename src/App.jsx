import { useState, useEffect } from 'react'
import {
	ChakraProvider,
	ColorModeScript,
	extendTheme,
	withDefaultColorScheme,
} from '@chakra-ui/react'
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui'

import '@utils/i18n'
import { getData } from '@utils/appStorage'
import Logger from '@utils/logger'
import DefaultLayout from '@layouts/layout_default'
import UpdateNotification from '@components/UpdateNotification'
import Footer from '@components/Footer'

import { customTheme } from '@utils/theme'

const log = Logger.getLogger('app')
export default function App({ swUpdate, registration }) {
	const [systemSync, setSystemSync] = useState(false)

	const currentTheme = extendTheme(
		extendTheme({
			...customTheme,
			config: {
				initialColorMode: 'dark',
				useSystemColorMode: systemSync,
			},
		}),
		withDefaultColorScheme({ colorScheme: 'yellow' })
	)

	useEffect(() => {
		;(async () => {
			await getData('useSystemColorMode').then((sync) => {
				if (sync && typeof sync === 'boolean') {
					log.info(['APP'], `Is using system color mode?: ${sync}`)
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
					<UpdateNotification
						isUpdateAvailable={swUpdate}
						registration={registration}
					/>
					<DefaultLayout />
					<Footer />
				</ThemeEditorProvider>
			</ChakraProvider>
		</>
	)
}
