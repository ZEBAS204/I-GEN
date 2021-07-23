import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { update } from '../../redux/reducer_updateUI'

import { getData, setData } from '../../utils/appStorage'
import {
	Box,
	Text,
	Link,
	Icon,
	Divider,
	Switch,
	Stack,
	Spacer,
	Heading,
	Select,
} from '@chakra-ui/react'
import { RiExternalLinkLine } from 'react-icons/ri'

// Translations
import { useTranslation } from 'react-i18next'
import { supportedLanguages } from '../../utils/supportedLanguages'

export default function Interface() {
	const { t, i18n } = useTranslation()

	// This functions bind to the useDispatch
	// and allows to send a signal to update other UI components
	const dispatch = useDispatch()
	const updateUI = () => dispatch(update())

	const [notifications, setNotifications] = useState(false)
	const [navDirection, setNavDirection] = useState(false)

	const toggleNotify = () => {
		const newValue = !notifications
		setNotifications(newValue)
		setData('notify_enabled', newValue)
	}

	const toggleNavDir = () => {
		const newValue = !navDirection
		setNavDirection(newValue)
		// Nav Direction uses number instead of a boolean
		setData('side_nav_direction', newValue ? 1 : 0)

		// Update UI
		updateUI()
	}

	useEffect(() => {
		;(async () => {
			await getData('notify_enabled').then((isEnabled) => {
				setNotifications(isEnabled !== null ? isEnabled : false)
			})

			await getData('side_nav_direction').then((navDir) => {
				if (navDir !== null) {
					// TODO: send force update signal
					// Convert number to boolean
					setNavDirection(!!navDir)
				}
			})
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
					value={
						// Get current language without country code
						i18n.languages[0]
					}
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
			<Text>
				If you would like to contribute to translations{' '}
				{
					// TODO: Use environment variable
				}
				<Link href="#" isExternal>
					click here {<Icon as={RiExternalLinkLine} />}
				</Link>
			</Text>

			<br />
			<Divider />
			<br />

			<Heading size="md">{t('settings.navbar')}</Heading>
			<br />
			<Stack direction="row">
				<Heading size="sm">Move navigation bar to the right</Heading>
				<Spacer />
				<Switch onChange={toggleNavDir} isChecked={navDirection} />
			</Stack>

			<br />
			<Divider />
			<br />

			<Heading size="md">{t('settings.notifications')}</Heading>
			<br />
			<Stack direction="row">
				<Heading size="sm">Send notification</Heading>
				<Spacer />
				<Switch onChange={toggleNotify} isChecked={notifications} />
			</Stack>
			<Text>Send a notification when a new set of words are generated</Text>
		</>
	)
}
