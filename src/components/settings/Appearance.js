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

// TODO: add option to use navbar as in darkmode for light mode (note: too many mode words)
// TODO: update components when changing options
// @see https://reactjs.org/docs/context.html#reactcreatecontext

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
			<Heading size="md">{t('settings.theme')}</Heading>
			<br />
			<Heading size="sm">Change theme</Heading>
			<Text>Blind or not blind. That's the question</Text>
			<Box padding="4">
				<RadioGroup onChange={(toggleTheme, changeTheme)} value={theme}>
					<Stack>
						<Radio value="light">Light</Radio>
						<Radio value="dark">Dark</Radio>
						<Radio value="auto">Sync with computer</Radio>
					</Stack>
				</RadioGroup>
			</Box>
			<br />
			<Stack direction="row">
				<Text>Dark sidebar</Text>
				<Spacer />
				<Switch
					isChecked={theme === 'dark' ? false : true}
					isDisabled={theme === 'light' ? false : true}
				/>
			</Stack>
			<br />
			<Divider />
			<br />
			<Heading size="md">Repository Icon</Heading>
			<Stack direction="row">
				<Text>Show Project repository quick link icon in navigation bar</Text>
				<Spacer />
				<Switch onChange={changeIconVis} isChecked={showIcon} />
			</Stack>
			<br />
			HERE: Use animations (?)
		</>
	)
}
