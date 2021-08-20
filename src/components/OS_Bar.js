//import Electron from 'electron';
import React, { useState, useEffect } from 'react'
import { getData } from '../utils/appStorage'

import {
	Flex,
	Box,
	useColorModeValue,
	IconButton,
	Stack,
	ButtonGroup,
	Spacer,
} from '@chakra-ui/react' // chakra-ui Framework
import {
	// Windows
	RiSubtractLine,
	RiCheckboxMultipleBlankLine,
	RiCloseLine,
	// Linux
	RiCheckboxIndeterminateLine,
	RiCheckboxBlankLine,
	RiCloseCircleLine,
	// Mac
	RiCheckboxBlankCircleFill,
} from 'react-icons/ri'
import Logger from '../utils/logger'

function OS_MENU_BAR() {
	const [isElectron, setElectronInstance] = useState(false)
	const bgColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200') // Theme colors (light, dark)

	useEffect(() => {
		;(async () => {
			// TODO: don't add OS bar in mobile
			// TODO: bind electron buttons
			await getData('electron').then((e) => {
				Logger.log(['OS', 'info'], 'Electron: ' + e)
				if (e) {
					Logger.log(['OS', 'info'], 'Running on Electron, window menu bar')
				} else {
					Logger.log(['OS', 'info'], 'Not running on Electron')
				}
				setElectronInstance(e)
			})
		})()
	}, [])
	if (!isElectron) {
		return <></>
	}

	return (
		<Box bg={bgColor} p="4px">
			<Stack direction="row" align="center">
				<p>LOGO/ICON</p>
				<Spacer />
				<Flex justify="flex-end">
					<ButtonGroup
						className="os-menu-bar-icons"
						mr="10px"
						variant="ghost"
						size="sm"
					>
						<IconButton
							aria-label="Minimize Button"
							onClick={() => {
								console.info('[OS] MINIMIZED')
							}}
							icon={<RiCheckboxBlankCircleFill />}
							isRound
						/>
						<IconButton
							aria-label="Maximize Button"
							onClick={() => {
								console.info('[OS] MAXIMIZE/RESTORE')
							}}
							icon={<RiCheckboxBlankCircleFill />}
							isRound
						/>
						<IconButton
							aria-label="Close Button"
							onClick={() => {
								console.info('[OS] CLOSED')
							}}
							icon={<RiCheckboxBlankCircleFill />}
							isRound
						/>
					</ButtonGroup>
				</Flex>
			</Stack>
		</Box>
	)
}

export default OS_MENU_BAR
