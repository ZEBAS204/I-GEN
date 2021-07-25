// FIXME: tooltips keep open without been hovered.

// FIXME: wrong colours if is using 'dark sidebar enabled'
// FIXME: expand arrow button wrong colour if is using 'dark sidebar enabled'
// FIXME: expand arrow button wrong direction if is using navbar order

//import Electron from 'electron';
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { NavLink } from 'react-router-dom'
import { getData } from '../utils/appStorage'

import { useTranslation } from 'react-i18next'

import {
	chakra, // Custom html elements
	Tooltip,
	useColorMode,
	useColorModeValue,
	IconButton,
	Stack,
	Spacer,
} from '@chakra-ui/react'
import {
	RiCloudyFill,
	RiTimerFlashFill,
	RiSettings3Fill,
	RiMoonClearFill,
	RiSunFill,
	RiArrowRightSLine,
} from 'react-icons/ri' // Icons

// Style
import '../assets/scss/components/SideNavBar.scss'

function SideNav() {
	const { toggleColorMode } = useColorMode()
	const { t } = useTranslation()

	// Allow forcing update from signal
	const dummy = useSelector((state) => state.updateUI.value)

	const navButtons = [
		{
			location: 'buttons.home',
			navlink: {
				to: '/',
				exact: true,
			},
			icon: <RiCloudyFill />,
		},
		{
			location: 'buttons.timermode',
			navlink: {
				to: '/timer',
			},
			icon: <RiTimerFlashFill />,
		},
		{
			location: 'buttons.settings',
			navlink: {
				to: '/settings',
				exact: true,
			},
			icon: <RiSettings3Fill />,
		},
	]

	const [NavDirection, setNavDirection] = useState(0) // (0 left; 1 right)
	const [navExpanded, setNavExpanded] = useState(false)
	const [useTooltips, setUseTooltips] = useState(true)

	const [showThemeSwapIcon, setThemeSwapVisibility] = useState(true)
	const [darkNavbar, setDarkNavbar] = useState(false) // If navbar will be dark mode in lightmode

	// Theme colors (light, dark)
	const bgColor = useColorModeValue(
		// TODO: set fill colors
		darkNavbar ? 'black' : 'transparent',
		darkNavbar ? 'black' : 'transparent'
	)
	const themeIcon = useColorModeValue(<RiSunFill />, <RiMoonClearFill />) //! rem

	const handleNavExpand = () => {
		setNavExpanded(!navExpanded)
	}

	useEffect(
		() => {
			;(async () => {
				await getData('side_nav_direction').then((dir) => {
					// Only accept 0 or 1, the user could changed it in localstorage
					// If check not match, default will be left
					let _dir = dir === 0 || dir === 1 ? dir : 0
					setNavDirection(_dir)
				})
				await getData('side_nav_fill').then((dark) => {
					setDarkNavbar(dark !== null ? dark : false)
				})
				await getData('theme_swap_icon').then((display) => {
					setThemeSwapVisibility(display !== null ? display : true)
				})
				await getData('side_nav_tooltips').then((isEnabled) => {
					setUseTooltips(isEnabled !== null ? isEnabled : true)
				})
			})()
		},
		// This will allows us to manually force re-render of this component
		[dummy]
	)

	return (
		<chakra.nav
			className={`navbar ${navExpanded ? 'expanded' : ''}`}
			bg={bgColor}
			order={NavDirection}
		>
			<Stack as="ul" className="navbar-icons-row" py={5}>
				{
					// Load all navigation buttons
					navButtons.map((btn, key) => {
						return (
							<Tooltip
								key={key}
								label={t(btn.location)}
								placement="auto-start"
								openDelay={500}
								closeOnClick={true}
								gutter="0"
								isDisabled={
									// If nav is expanded, will not use tooltips
									// Else, if are enabled by user (default) will be displayed
									navExpanded ? true : useTooltips ? false : true
								}
							>
								{
									// If navlink exist, create a link and copy attributes
									btn.navlink ? (
										<NavLink {...btn.navlink}>
											<IconButton
												className="navbar-icons-row-button"
												icon={btn.icon}
												{...btn.buttonAttributes}
											/>
										</NavLink>
									) : (
										// If not, just create an icon button
										<IconButton
											className="navbar-icons-row-button"
											icon={btn.icon}
											{...btn.buttonAttributes}
										/>
									)
								}
							</Tooltip>
						)
					})
				}
				{
					// ! Dev, remove later
					showThemeSwapIcon && (
						<div>
							<Tooltip
								label="YES"
								placement="auto-start"
								openDelay={500}
								closeOnClick={true}
								gutter="0"
							>
								<IconButton
									aria-label="Swap theme icon"
									className="navbar-icons-row-button"
									onClick={toggleColorMode}
									icon={themeIcon}
								/>
							</Tooltip>
						</div>
					)
				}

				<chakra.div
					className="navbar-icons-row-expand-button"
					display="contents"
				>
					<Spacer />
					<div>
						<IconButton
							aria-label="Expand Menu"
							icon={<RiArrowRightSLine />}
							variant="ghost"
							isRound={true}
							onClick={handleNavExpand}
							style={{
								transform: `rotate(${navExpanded ? '180deg' : '0deg'})`,
							}}
						/>
					</div>
				</chakra.div>
			</Stack>
		</chakra.nav>
	)
}

export default SideNav
