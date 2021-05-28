import React, { useState, useEffect } from 'react'
import { getData, setData } from '../../utils/appStorage'
import {
	Box,
	Text,
	Divider,
	Radio,
	RadioGroup,
	useColorMode,
	useColorModeValue,
} from '@chakra-ui/react'

import { useTranslation } from 'react-i18next' // Translations

function Interface() {
	const { t, i18n } = useTranslation()
	const [themeMode, toggleColorMode] = useState(useColorMode())

	useEffect(() => {
		;(async () => {
			// a
		})()
	}, [])

	return (
		<>
			<Text fontSize="xl">{t('settings.interface')}</Text>
			<Divider />
			<Box>
				<Text>Theme</Text>
				<RadioGroup onChange={toggleColorMode} value={themeMode}>
					<Radio></Radio>
				</RadioGroup>
			</Box>
			HERE: Language, Accessibility (read generated text? - read volume),
			Notifications (timer mode :D - mute notif.), save settings (idk why but
			should be) Use animations (?)
		</>
	)
}

export default Interface
