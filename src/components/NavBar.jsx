import { useTranslation } from 'react-i18next'
import {
	chakra,
	useColorMode,
	useColorModeValue,
	Button,
	Spacer,
	Icon,
} from '@chakra-ui/react'
import {
	RiTimerFlashLine,
	RiTimerFlashFill,
	RiSettings3Line,
	RiSettings3Fill,
	RiMoonClearFill,
	RiSunFill,
} from 'react-icons/ri'

import { useAppContext } from '../layouts/AppContext'
import GenerateButton from './common/GenerateButton.jsx'

// Style
import '../assets/scss/components/NavBar.scss'

export default function SideNav() {
	const { toggleColorMode } = useColorMode()
	const { t } = useTranslation()

	const themeIcon = useColorModeValue(RiSunFill, RiMoonClearFill)
	const {
		isInMobileView,
		isTimerVisible,
		isSettingVisible,
		toggleSettingVisible,
		toggleTimerVisible,
	} = useAppContext()

	const SettingsButton = () => (
		<Button
			variant="unstyled"
			className={`navbar-item ${isSettingVisible ? 'active' : ''}`}
			aria-label="Settings"
			onClick={toggleSettingVisible}
		>
			<Icon
				className="navbar-item-icon"
				as={isSettingVisible ? RiSettings3Fill : RiSettings3Line}
			/>
			<span className="navbar-item-label">{t('buttons.settings')}</span>
		</Button>
	)

	const desktopNav = (
		<>
			<SettingsButton />
			<Spacer />
			<h1>LOGO</h1>
			<Spacer />

			<Button
				variant="unstyled"
				className="navbar-item"
				aria-label="Swap theme icon"
			>
				<Icon
					className="navbar-item-icon"
					as={themeIcon}
					onClick={toggleColorMode}
				/>
			</Button>
		</>
	)

	const mobileNav = (
		<>
			<Button
				variant="unstyled"
				className={`navbar-item ${isTimerVisible ? 'active' : ''}`}
				aria-label="Timer"
				onClick={toggleTimerVisible}
			>
				<Icon
					className="navbar-item-icon"
					as={isTimerVisible ? RiTimerFlashFill : RiTimerFlashLine}
				/>
				<span className="navbar-item-label">{t('buttons.timermode')}</span>
			</Button>
			<Spacer />
			<GenerateButton />
			<Spacer />
			<SettingsButton />
		</>
	)

	return (
		<chakra.nav className="nabvar" justify="center">
			{isInMobileView ? mobileNav : desktopNav}
		</chakra.nav>
	)
}
