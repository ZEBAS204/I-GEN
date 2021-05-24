//import Electron from 'electron';
import React, { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { getData } from '../utils/appStorage'

import { useTranslation } from 'react-i18next'

import {
	chakra, // Custom html elements
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
				setNavDirection(dir)
			})
			await getData('github_icon').then((display) => {
				setGitIconVisibility(display)
			})
			await getData('theme_swap_icon').then((display) => {
				setThemeSwapVisibility(display)
			})
		})()
	}, [])

	console.log('[OS] Running on electron, returning menu bar')

	return (
		<chakra.nav className="navbar" bg={bgColor} order={NavDirection}>
			{/* Should use Wrap? */}
			<Stack as="ul" className="navbar-icons-row">
				<NavLink exact to="/">
					<IconButton
						aria-label="Home"
						className="navbar-icons-row-button"
						icon={<IoHomeSharp />}
					/>
				</NavLink>
				<NavLink to="/timer">
					<IconButton
						aria-label="Timer mode"
						className="navbar-icons-row-button"
						icon={<IoTimer />}
					/>
				</NavLink>
				{showGithubIcon && (
					<a
						href="https://www.example.com" // TODO: use node package env variable
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
				)}
				<NavLink to="/settings">
					<IconButton
						aria-label="Settings"
						className="navbar-icons-row-button"
						icon={<IoSettingsSharp />}
					/>
				</NavLink>
				{showThemeSwapIcon && (
					<div>
						<IconButton
							aria-label="Swap theme icon"
							className="navbar-icons-row-button"
							onClick={toggleColorMode}
							icon={themeIcon}
						/>
					</div>
				)}
			</Stack>
		</chakra.nav>
	)
}

export default SideNav
