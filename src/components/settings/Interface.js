import React, { useState, useEffect } from 'react'
import { getData, setData } from '../../utils/appStorage'
import {
	Box,
	Text,
	Divider,
	Radio,
	RadioGroup,
	useColorMode,
	Switch,
	Stack,
	Spacer,
	Heading,
} from '@chakra-ui/react'

import { useTranslation } from 'react-i18next' // Translations

// TODO: default page (normal or timed mode)

function Interface() {
	const { t, i18n } = useTranslation()

	useEffect(() => {
		;(async () => {
			//a
		})()
	}, [])

	return (
		<>
			<Heading>{t('settings.interface')}</Heading>
			<br />
			<Divider />
			<br />
			<Box>
				<Text>
					HERE: Language, Accessibility (read generated text? - read volume),
					Notifications (timer mode :D - mute notifications), save settings (idk
					why but should be) Use animations (?)
				</Text>
			</Box>
		</>
	)
}

export default Interface
