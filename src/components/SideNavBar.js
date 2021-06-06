// TODO: tooltips keep open without been hovered.

//import Electron from 'electron';
import React, { useState, useEffect } from 'react'
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
} from '@chakra-ui/react' // chakra-ui Framework
import {
	IoHomeSharp,
	IoTimer,
	IoSettingsSharp,
	IoLogoGithub,
	IoMoon,
	IoSunny,
} from 'react-icons/io5' // Icons

// Style
import '../assets/scss/components/SideNavBar.scss'

function SideNav() {
	const [showGithubIcon, setGitIconVisibility] = useState(true)
	const [showThemeSwapIcon, setThemeSwapVisibility] = useState(true)
	const [NavDirection, setNavDirection] = useState(0) // (0 left; 1 right)
	const bgColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200') // Theme colors (light, dark)
	const themeIcon = useColorModeValue(<IoSunny />, <IoMoon />)
	const { toggleColorMode } = useColorMode()
	const { t } = useTranslation()

	useEffect(() => {
		;(async () => {
			await getData('side_nav_direction').then((dir) => {
				// Only accept 0 or 1, the user could changed it in localstorage
				// If check not match, default will be left
				let _dir = dir === 0 || dir === 1 ? dir : 0
				setNavDirection(_dir)
			})
			await getData('github_icon').then((display) => {
				setGitIconVisibility(display !== null ? display : true)
			})
			await getData('theme_swap_icon').then((display) => {
				setThemeSwapVisibility(display !== null ? display : true)
			})
		})()
	}, [])

	console.log('[OS] Running on electron, returning menu bar')

	return (
		<chakra.nav className="navbar" bg={bgColor} order={NavDirection}>
			<Stack as="ul" className="navbar-icons-row">
				<Tooltip
					label={t('buttons.home')}
					placement="auto-start"
					openDelay={500}
					gutter="0"
				>
					<div>
						<NavLink exact to="/">
							<IconButton
								aria-label="Home"
								className="navbar-icons-row-button"
								icon={<IoHomeSharp />}
							/>
						</NavLink>
					</div>
				</Tooltip>
				<Tooltip
					label={t('buttons.timermode')}
					placement="auto-start"
					openDelay={500}
					gutter="0"
				>
					<div>
						<NavLink to="/timer">
							<IconButton
								aria-label="Timer Mode"
								className="navbar-icons-row-button"
								icon={<IoTimer />}
							/>
						</NavLink>
					</div>
				</Tooltip>
				{showGithubIcon && (
					<Tooltip
						label="Repo"
						placement="auto-start"
						openDelay={500}
						gutter="0"
					>
						<div>
							<a
								href="https://www.example.com" // TODO: use env variable
								target="_blank"
								rel="noopener noreferrer"
							>
								<IconButton
									aria-label="Github"
									className="navbar-icons-row-button"
									onClick={() => {
										console.log('Clicked github icon')
									}}
									icon={<IoLogoGithub />}
								/>
							</a>
						</div>
					</Tooltip>
				)}
				<Tooltip
					label={t('buttons.settings')}
					placement="auto-start"
					openDelay={500}
					gutter="0"
				>
					<div>
						<NavLink to="/settings">
							<IconButton
								aria-label="Settings"
								className="navbar-icons-row-button"
								icon={<IoSettingsSharp />}
							/>
						</NavLink>
					</div>
				</Tooltip>
				{
					// ! Dev, remove later
					showThemeSwapIcon && (
						<div>
							<IconButton
								aria-label="Swap theme icon"
								className="navbar-icons-row-button"
								onClick={toggleColorMode}
								icon={themeIcon}
							/>
						</div>
					)
				}
			</Stack>
		</chakra.nav>
	)
}

export default SideNav
