import { useTranslation } from 'react-i18next'
import { chakra, useColorMode, Icon } from '@chakra-ui/react'
import { HiSun, HiMoon } from 'react-icons/hi'
import Toggle from 'react-toggle'
import '@styles/components/ColorModeToggle.scss'

const MoonIcon = () => <Icon as={HiMoon} boxSize={5} />
const SunIcon = () => <Icon as={HiSun} boxSize={5} />

const ThemeSwitch = () => {
	const { t } = useTranslation()
	const { colorMode, toggleColorMode } = useColorMode()

	return (
		<chakra.div
			as={Toggle}
			name={t('settings.theme_toggle')}
			value={t(`settings.theme_${colorMode}`)}
			color="yellow"
			icons={{
				checked: <SunIcon />,
				unchecked: <MoonIcon />,
			}}
			onClick={toggleColorMode}
		/>
	)
}

export { ThemeSwitch as ColorModeToggle }
