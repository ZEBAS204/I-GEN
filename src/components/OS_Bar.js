//import Electron from 'electron';
import React, { useState, useEffect } from 'react'
import { getData } from '../utils/appStorage'

import { useTranslation } from 'react-i18next'

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
	//*IoRemove, IoScan, IoClose, // Windows
	//*IoRemoveCircle, IoScanCircle, IoCloseCircle, // Linux
	IoEllipse, // Mac
} from 'react-icons/io5' // Material Design Icons

function OS_MENU_BAR() {
	const [isElectron, setElectronInstance] = useState(false)
	const bgColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200') // Theme colors (light, dark)
	const { t } = useTranslation()

	useEffect(() => {
		;(async () => {
			// TODO: Don't add OS bar in mobile
			await getData('electron').then((e) => {
				console.log('[OS] Electron:', e)
				setElectronInstance(e)
			})
		})()
	}, [])
	if (!isElectron) {
		console.log('[OS] Not running electron, returning null')

		return <></>
	}

	console.log('[OS] Running on electron, returning menu bar')
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
							title={t('minimize_btn')}
							onClick={() => {
								console.info('[OS] MINIMIZED')
							}}
							icon={<IoEllipse />}
							isRound
						/>
						<IconButton
							aria-label="Maximize Button"
							title={t('maximize_btn')}
							onClick={() => {
								console.info('[OS] MAXIMIZE/RESTORE')
							}}
							icon={<IoEllipse />}
							isRound
						/>
						<IconButton
							aria-label="Close Button"
							title={t('close_btn')}
							onClick={() => {
								console.info('[OS] CLOSED')
							}}
							icon={<IoEllipse />}
							isRound
						/>
					</ButtonGroup>
				</Flex>
			</Stack>
		</Box>
	)
}

export default OS_MENU_BAR
