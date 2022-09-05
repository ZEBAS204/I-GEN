/**
 ** Current limitations of this method to allow user to change themes:
 ** ChakraUI trade-off in term of performance footprint can be easy visualized
 ** when changing themes. This performance drop is a noticeable in low-spec devices
 !! With React Developer Tools, this component will take a tiny more to load
 */

import { useState, useEffect } from 'react'
import CustomThemeEditor from './CustomThemeEditor'

import { useTranslation } from 'react-i18next'
import { getData, setData } from '@utils/appStorage'
import { Checkbox, Stack, Spacer, Heading } from '@chakra-ui/react'
import { ColorModeToggle } from './ColorModeToggle'

var prevSelectedSync = null

export default function Appearance() {
	const { t } = useTranslation()

	// This functions bind to the useDispatch
	// and allows to send a signal to update other UI components
	const [systemSync, setSystemSync] = useState(prevSelectedSync ?? false)

	const toggleSystemSync = (val) => {
		setSystemSync(val)
		prevSelectedSync = val
		setData('useSystemColorMode', val)
	}

	useEffect(() => {
		;(async () => {
			prevSelectedSync === null &&
				(await getData('useSystemColorMode').then((sync) => {
					prevSelectedSync = sync
					setSystemSync(sync ? true : false)
				}))
		})()
	}, [])

	return (
		<>
			<Stack direction="row" alignItems="center">
				<Heading size="md">{t('settings.theme')}</Heading>
				<Spacer />
				<ColorModeToggle size="lg" />
				<CustomThemeEditor />
			</Stack>
			<Checkbox
				pl={2}
				isChecked={systemSync}
				onChange={(e) => toggleSystemSync(e.target.checked)}
			>
				{t('settings.theme_sync')}
			</Checkbox>{' '}
		</>
	)
}
