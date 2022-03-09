import { useRef } from 'react'

import { useTranslation } from 'react-i18next'
import { useHotkeys } from 'react-hotkeys-hook'

import { useAppContext } from '../layouts/AppContext'

import {
	chakra,
	useColorMode,
	useColorModeValue,
	IconButton,
	Spacer,
	useMediaQuery,
	Tag, // Used to get color scheme in buttons
} from '@chakra-ui/react'
import {
	RiTimerFlashLine,
	RiTimerFlashFill,
	RiSettings3Line,
	RiSettings3Fill,
	RiMoonClearFill,
	RiSunFill,
} from 'react-icons/ri'

// Style
import '../assets/scss/components/SideNavBar.scss'

export default function SideNav() {
	const { toggleColorMode } = useColorMode()
	const { t } = useTranslation()
	const [isInMobileView] = useMediaQuery('(max-width: 650px)')

	const themeIcon = useColorModeValue(<RiSunFill />, <RiMoonClearFill />)
	const { toggleSettingVisible } = useAppContext()

	// Bind keys to elements
	const hotkeys = {
		// home: useRef(null),
		timer: useRef(null),
		settings: useRef(null),
		theme: useRef(null),
	}
	//useHotkeys('shift+1', () => hotkeys.home.current?.click())
	useHotkeys('shift+2', () => hotkeys.timer.current?.click())
	useHotkeys('shift+3', () => hotkeys.settings.current?.click())
	useHotkeys('shift+c', () => hotkeys.theme.current?.click())

	return (
		<chakra.nav className="nabvar" justify="center">
			<Tag
				variant="outline"
				className="navbar-item"
				ref={hotkeys.settings}
				onClick={toggleSettingVisible}
				exact
			>
				<RiSettings3Fill className="navbar-item-icon-active" />
				<RiSettings3Line className="navbar-item-icon" />
				<span className="navbar-item-label">{t('buttons.settings')}</span>
			</Tag>
			<Spacer className="navbar-spacer" />
			{!isInMobileView && (
				<>
					<h1 color="blue">LOGO</h1>
					<Spacer className="navbar-spacer" />
				</>
			)}
			<Tag variant="outline" className="navbar-item navbar-swap-button">
				<IconButton
					aria-label="Swap theme icon"
					ref={hotkeys.theme}
					onClick={toggleColorMode}
					className="navbar-item-icon"
					icon={themeIcon}
					variant="unstyled"
				/>
			</Tag>
		</chakra.nav>
	)
}
