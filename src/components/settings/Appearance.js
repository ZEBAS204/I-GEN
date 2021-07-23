import React, { useState, useEffect } from 'react'

import { useDispatch } from 'react-redux'
import { update } from '../../redux/reducer_updateUI'

import { getData, setData } from '../../utils/appStorage'
import {
	Box,
	Text,
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
// @see https://reactjs.org/docs/context.html#reactcreatecontext

export default function Appearance() {
	const { t } = useTranslation()

	// This functions bind to the useDispatch
	// and allows to send a signal to update other UI components
	const dispatch = useDispatch()
	const updateUI = () => dispatch(update())

	const [theme, toggleThemeValue] = useState(useColorMode().colorMode)
	const { toggleTheme } = useColorMode()
	const [darkNavbar, setDarkNavbar] = useState(false)

	const changeTheme = (value) => {
		toggleThemeValue(value ? value : 'dark')

		console.log('Old theme:', theme)
		console.log('New theme:', value)
	}

	const toggleNavbarDark = () => {
		const darkEnabled = !darkNavbar

		setData('side_nav_fill', darkEnabled)
		setDarkNavbar(darkEnabled)

		updateUI()
	}

	useEffect(() => {
		;(async () => {
			await getData('side_nav_fill').then((darkNavEnabled) => {
				setDarkNavbar(darkNavEnabled !== null ? darkNavEnabled : false)
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
				<Switch value={darkNavbar} onChange={toggleNavbarDark} />
			</Stack>
			<br />
			HERE: Use animations (?)
		</>
	)
}
