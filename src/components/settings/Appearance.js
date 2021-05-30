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

// TODO: update components when changing options

export default function Appearance() {
	const { t } = useTranslation()
	const [theme, toggleThemeValue] = useState(useColorMode().colorMode)
	const { toggleTheme } = useColorMode()
	const [showIcon, setGitIconVisibility] = useState(true)

	const changeTheme = (value) => {
		toggleThemeValue(value ? value : 'dark')

		console.log('Old theme:', theme)
		console.log('New theme:', value)
	}

	const changeIconVis = () => {
		if (typeof showIcon === 'boolean') {
			const icon = !showIcon

			setData('github_icon', icon)
			setGitIconVisibility(icon)
		} else {
			console.error('Component error, icon value should be a boolean!')
		}
	}

	useEffect(() => {
		;(async () => {
			await getData('github_icon').then((icon) => {
				setGitIconVisibility(icon !== null ? icon : true)
			})
		})()
	}, [])

	return (
		<>
			<Heading>{t('settings.appearance')}</Heading>
			<br />
			<Divider />
			<br />
			<Box>
				<Text>Theme</Text>
				<RadioGroup onChange={(toggleTheme, changeTheme)} value={theme}>
					<Stack>
						<Radio value="light">Light</Radio>
						<Radio value="dark">Dark</Radio>
					</Stack>
				</RadioGroup>
			</Box>
			<Divider />
			<Stack direction="row">
				<Text>Show Project repository quick link icon in navigation bar</Text>
				<Spacer />
				<Switch onChange={changeIconVis} isChecked={showIcon} />
			</Stack>
			<br />
			HERE: Language, Accessibility (read generated text? - read volume),
			Notifications (timer mode :D - mute notifications), save settings (idk why
			but should be) Use animations (?)
		</>
	)
}
