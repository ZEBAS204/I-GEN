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
	Select,
} from '@chakra-ui/react'

// Translations
import { useTranslation } from 'react-i18next'
import { supportedLanguages } from '../../utils/supportedLanguages'

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
			<Heading size="md">{t('settings.language')}</Heading>
			<br />
			<Heading size="sm">Select language to use</Heading>
			<Box shadow="base" marginTop={2}>
				<Select
					variant="filled"
					value={i18n.language}
					onChange={(e) => i18n.changeLanguage(e.target.value)}
				>
					{
						// Get all available languages
						supportedLanguages.map((lang, key) => (
							<option value={lang.code} key={`lng-${lang}-${key}`}>
								{lang.name}
							</option>
						))
					}
				</Select>
			</Box>
			<br />
			<Divider />
			<br />
			<Box>
				<Text>
					HERE: Notifications (timer mode :D - mute notifications), Use
					animations (?)
				</Text>
			</Box>
		</>
	)
}

export default Interface
