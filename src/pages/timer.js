/**
 * Depends on:
 *		* components/WordGenerator.js
 *		* components/timer/CountDown.js
 *		* components/timer/CountDownControls.js
 */
import React, { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next' // Translations

import {
	useColorModeValue,
	Center,
	Flex,
	Button,
	ButtonGroup,
	IconButton,
} from '@chakra-ui/react'
import { RiPlayFill, RiPauseFill, RiEditBoxFill } from 'react-icons/ri' // Icons
import WordGenerator from '../components/WordGenerator'
import CountDown from '../components/timer/CountDown'
import CountDownControls from '../components/timer/CountDownControl'
import TTS from '../utils/tts'

// Name of the key to use in session storage
const SS_NAME = 'countdown_time'
const DEF_TIME = 10000 // 10 min
const MIN_TIME = 0
const MAX_TIME = 215999

export default function TimerMode() {
	const { t } = useTranslation()

	// Create a reference to generator component
	const genREF = useRef(null)
	const generator = () => genREF.current.regenerateWord()

	const bgColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')

	const [running, setRunning] = useState(false)
	const [showEditable, setEditableVisib] = useState(false)
	const [timeSettings, setTime] = useState(DEF_TIME)

	// Get callback from CountDownControls(child) to update time
	const handleChildCallback = (newTime) => {
		//*console.log('[x] Child callback triggered!', newTime)

		if (!checkTimeValue(newTime)) return false

		setTime(newTime)

		// Save countdown state in Session Storage
		try {
			window.sessionStorage.setItem(SS_NAME, JSON.stringify(newTime))
		} catch (access_denied) {}
	}

	const toggleRunning = () => setRunning(!running)

	// CountDown ended
	const countDownEND = () => {
		// TTS
		//* console.log('Countdown ended, received speak signal.')
		generator()
	}

	// Show editable time
	const showControls = () => {
		// Pause if timer is running
		setRunning(false)

		// Show or hide editable time controls
		setEditableVisib(!showEditable)
	}

	useEffect(() => {
		;(() => {
			// On mount, get any saved state inside Session Storage
			try {
				if (window.sessionStorage.getItem(SS_NAME)) {
					// Save storage object
					const saved = JSON.parse(window.sessionStorage.getItem(SS_NAME))

					if (checkTimeValue(saved)) {
						setTime(parseInt(saved))
					}
				}
			} catch (access_denied) {
				//* console.error('Session Storage access denied', access_denied)
			}
		})()

		// On dismount, send TTS signal to stop speaking
		return () => {
			TTS.stop()
		}
	}, [])

	return (
		<Center
			p={3}
			bg={bgColor}
			borderRadius="md"
			flexBasis="100%" // Allow to fill empty space
		>
			<div>
				<Flex flexDirection="column">
					<WordGenerator ref={genREF} />
					<br />
					<ButtonGroup
						size="md"
						colorScheme="blue"
						alignSelf="center"
						isAttached
					>
						{running ? (
							<Button
								variant="solid"
								rightIcon={<RiPauseFill />}
								onClick={toggleRunning}
								alignSelf="center"
							>
								{t('buttons.stop_btn')}
							</Button>
						) : (
							<Button
								variant="solid"
								rightIcon={<RiPlayFill />}
								onClick={toggleRunning}
							>
								{t('buttons.play_btn')}
							</Button>
						)}

						<IconButton
							variant="outline"
							icon={<RiEditBoxFill />}
							onClick={showControls}
						/>
					</ButtonGroup>
				</Flex>
				<br />
				{
					/* Show timer control or countdown respectively
					 * Editables need to be as function, so on update doesn't re-render
					 */
					showEditable ? (
						<CountDownControls
							parentCallback={handleChildCallback} // Allows to get time change
							savedTime={timeSettings} // Send saved time
						/>
					) : (
						<CountDown
							savedTime={timeSettings} // Send saved time
							parentRunning={running} // Send running status
							speak={countDownEND} // Allows to send speak signal
						/>
					)
				}
			</div>
		</Center>
	)
}

/**
 * Checks if the passed time is valid for this component
 * @param {Number} time
 * @return {Boolean}
 */
const checkTimeValue = (time) => {
	// Check if stored state is invalid
	if (!time || typeof time !== 'number' || time < MIN_TIME || time > MAX_TIME) {
		// console.log('Saved number wrong', time)
		return false
	}

	// console.log('Saved time looks fine', time)
	return true
}
