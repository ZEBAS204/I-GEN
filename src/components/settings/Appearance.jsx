/**
 ** Current limitations of this method to allow user to change themes:
 ** ChakraUI trade-off in term of performance footprint can be easy visualized
 ** when changing themes. This performance drop is a noticeable in low-spec devices
 !! With React Developer Tools, this component will take a tiny more to load
 */

import CustomThemeEditor from './CustomThemeEditor'

import { useTranslation } from 'react-i18next'
import { useLocalForage } from '@utils/appStorage'
import { Checkbox, Stack, Spacer, Heading, DarkMode } from '@chakra-ui/react'
import { ColorModeToggle } from './ColorModeToggle'

export default function Appearance() {
	const { t } = useTranslation()
	const [systemSync, setSystemSync] = useLocalForage(
		'useSystemColorMode',
		false
	)

	const toggleSystemSync = (val) => setSystemSync(val)

	return (
		<>
			<Stack direction="row" alignItems="center">
				<Heading size="md">{t('settings.theme')}</Heading>
				<Spacer />
				<ColorModeToggle size="lg" />
				<CustomThemeEditor />
			</Stack>
			<DarkMode>
				<Checkbox
					pl={2}
					isChecked={systemSync}
					onChange={(e) => toggleSystemSync(e.target.checked)}
				>
					{t('settings.theme_sync')}
				</Checkbox>
			</DarkMode>
		</>
	)
}
