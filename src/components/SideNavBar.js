import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'

import { getData } from '../utils/appStorage'
import { useTranslation } from 'react-i18next'
import { useHotkeys } from 'react-hotkeys-hook'

import {
	chakra,
	useColorMode,
	useColorModeValue,
	IconButton,
	Spacer,
	Tag, // Used to get color scheme in buttons
} from '@chakra-ui/react'
import {
	RiCloudyLine,
	RiCloudyFill,
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

	const [showThemeSwapIcon, setThemeSwapVisibility] = useState(true)
	const themeIcon = useColorModeValue(<RiSunFill />, <RiMoonClearFill />)

	// Bind keys to elements
	const hotkeys = {
		home: useRef(null),
		timer: useRef(null),
		settings: useRef(null),
		theme: useRef(null),
	}
	useHotkeys('shift+1', () => hotkeys.home.current?.click())
	useHotkeys('shift+2', () => hotkeys.timer.current?.click())
	useHotkeys('shift+3', () => hotkeys.settings.current?.click())
	useHotkeys('shift+c', () => hotkeys.theme.current?.click())

	useEffect(() => {
		;(async () =>
			await getData('theme_swap_icon').then((showIcon) =>
				setThemeSwapVisibility(showIcon ?? true)
			))()
	}, [])

	return (
		<chakra.nav className="nabvar">
			<Tag
				as={NavLink}
				variant="outline"
				className="navbar-item"
				ref={hotkeys.home}
				to="/"
				exact
			>
				<RiCloudyFill className="navbar-item-icon-active" />
				<RiCloudyLine className="navbar-item-icon" />
				<span className="navbar-item-label">{t('buttons.home')}</span>
			</Tag>
			<Tag
				as={NavLink}
				variant="outline"
				className="navbar-item"
				ref={hotkeys.timer}
				to="/timer"
			>
				<RiTimerFlashFill className="navbar-item-icon-active" />
				<RiTimerFlashLine className="navbar-item-icon" />
				<span className="navbar-item-label">{t('buttons.timermode')}</span>
			</Tag>
			<Tag
				as={NavLink}
				variant="outline"
				className="navbar-item"
				ref={hotkeys.settings}
				to="/settings"
				exact
			>
				<RiSettings3Fill className="navbar-item-icon-active" />
				<RiSettings3Line className="navbar-item-icon" />
				<span className="navbar-item-label">{t('buttons.settings')}</span>
			</Tag>
			<Spacer className="navbar-spacer" />
			{showThemeSwapIcon && (
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
			)}
		</chakra.nav>
	)
}
