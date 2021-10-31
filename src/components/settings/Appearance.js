/**
 ** Current limitations of this method to allow user to change themes:
 ** ChakraUI trade-off in term of performance footprint can be easy visualized
 ** when changing themes. This performance drop is a noticeable in low-spec devices
 !! With React Developer Tools, this component will take a tiny more to load
 */

import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { update } from '../../redux/reducer_updateUI'

import { useTranslation } from 'react-i18next'
import { getData, setData } from '../../utils/appStorage'
import defaultThemes from '../../assets/defaultThemes.json'
import {
	chakra,
	Box,
	Text,
	Radio,
	RadioGroup,
	Checkbox,
	useColorMode,
	Stack,
	Grid,
	Divider,
	Heading,
} from '@chakra-ui/react'

var prevSelectedTheme = null

export default function Appearance() {
	const { t } = useTranslation()

	// This functions bind to the useDispatch
	// and allows to send a signal to update other UI components
	const dispatch = useDispatch()
	const updateUI = () => dispatch(update())

	const { colorMode, toggleColorMode } = useColorMode()
	const [systemSync, setSystemSync] = useState(false)

	const [theme, toggleThemeValue] = useState(prevSelectedTheme ?? 0)

	const toggleSystemSync = (val) => {
		setSystemSync(val)
		setData('useSystemColorMode', val)
	}

	const handleTheme = (color) =>
		setData('colorScheme', color)
			.then(() => (prevSelectedTheme = color))
			.then(() => updateUI())

	useEffect(() => {
		if (prevSelectedTheme !== null) return
		;(async () => {
			await getData('colorScheme').then((theme) => {
				//* Default themes: https://chakra-ui.com/docs/theming/theme
				if (
					typeof theme === 'string' &&
					defaultThemes instanceof Array &&
					defaultThemes.includes(theme)
				) {
					prevSelectedTheme = theme
					toggleThemeValue(theme)
				}
			})
			await getData('useSystemColorMode').then((sync) => {
				setSystemSync(sync ? true : false)
			})
		})()
	}, [])

	return (
		<>
			<Heading size="md">{t('settings.theme')}</Heading>
			<br />
			<Heading size="sm">Change theme</Heading>
			<Text>Blind or not blind. That's the question</Text>
			<Box padding={4}>
				<RadioGroup onChange={toggleColorMode} value={colorMode}>
					<Stack>
						<Radio value="light">Light</Radio>
						<Radio value="dark">Dark</Radio>
					</Stack>
				</RadioGroup>
				<br />
				<Checkbox
					isChecked={systemSync}
					onChange={(e) => toggleSystemSync(e.target.checked)}
				>
					Sync with system
				</Checkbox>{' '}
				(Applied on restart)
			</Box>
			<br />
			<Divider />
			<br />
			<Heading size="sm">🌟 Colorify 🌟</Heading>
			<Text>Pick your favorite color!</Text>
			<Grid
				gap={5}
				marginY={4}
				gridTemplateColumns="repeat(auto-fit, minmax(50px, 1fr))"
			>
				{defaultThemes.map((themeName, key) => {
					const isSelectedTheme = theme === themeName

					return (
						<chakra.button
							key={key}
							onClick={() => handleTheme(themeName)}
							title={t(`themes.${themeName}`)}
							aria-label={isSelectedTheme ? 'Selected' : null}
							cursor="pointer"
							type="button"
							w="3rem"
							h="3rem"
							bg={`var(--chakra-colors-${themeName}-500) content-box`}
							border={isSelectedTheme ? '5px solid transparent' : null}
							borderRadius="full"
							boxShadow={
								isSelectedTheme
									? `0 0 0 3px var(--chakra-colors-${themeName}-300)`
									: 'md'
							}
							disabled={isSelectedTheme}
						/>
					)
				})}
			</Grid>
		</>
	)
}
