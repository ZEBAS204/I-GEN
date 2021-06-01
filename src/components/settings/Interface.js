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

import { useTranslation } from 'react-i18next' // Translations

// TODO: default page (normal or timed mode)
// TODO: automatize available languages

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
			<Heading size="sm">Select langauge to use</Heading>
			<Box shadow="base">
				<Select
					variant="filled"
					value={i18n.language}
					onChange={(e) => i18n.changeLanguage(e.target.value)}
				>
					<option value="en">English</option>
					<option value="es">Spanish</option>
					{
						// Get all available languages
						/*
						i18n.languages().map((voice, val = -1) => {
							val++
							return (
								<option value={val} key={val}>
									{voice.name}
								</option>
							)
						})
						*/
					}
				</Select>
			</Box>
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
