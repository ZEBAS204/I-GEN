/**
 * Depends on:
 *		* components/WordGenerator.js
 *		* components/timer/CountDown.js
 *		* components/timer/CountDownControls.js
 */
import { useRef, useState, useEffect } from 'react'
import { Box, Button, ButtonGroup, IconButton } from '@chakra-ui/react'
import {
	RiPlayFill,
	RiPauseFill,
	RiEditBoxFill,
	RiRefreshLine,
} from 'react-icons/ri'
import { useTranslation } from 'react-i18next'
import { CountDown } from '../components/timer/CountDown'
import CountDownControls from '../components/timer/CountDownControl'
import TTS from '../utils/tts'

const SS_NAME = 'countdown_time' // Name of the key to use in session storage
const DEF_TIME = 600 // 10 min
const MIN_TIME = 0
const MAX_TIME = 215999

export default function TimerMode() {
	const { t } = useTranslation()

	// Create a reference to generator component
	const genREF = useRef(null)
	const generator = () => genREF.current && genREF.current.regenerateWord()

	const [running, setRunning] = useState(false)
	const [resetSignal, setReset] = useState(0)
	const [showEditable, setEditableVisib] = useState(false)
	const [timeSettings, setTime] = useState(DEF_TIME)

	// Get callback from CountDownControls(child) to update time
	const handleChildCallback = (newTime) => {
		if (!checkTimeValue(newTime)) return false

		setTime(newTime)
		// Save countdown state in Session Storage
		try {
			window.sessionStorage.setItem(SS_NAME, JSON.stringify(newTime))
		} catch (access_denied) {}
	}

	const toggleRunning = () => setRunning(!running)

	const resetTimer = () => {
		setReset(!resetSignal)
		countDownEND()
	}

	// CountDown ended, received callback signal from child
	const countDownEND = () => generator()

	const showControls = () => {
		setRunning(false)
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
			} catch (access_denied) {}
		})()

		// On dismount, send TTS signal to stop speaking
		return () => {
			TTS.stop()
		}
	}, [])

	return (
		<>
			<h1>Timer Mode</h1>
			<Box marginY={5} />
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
						reset={resetSignal}
					/>
				)
			}
			<ButtonGroup size="md" marginY={5} isAttached>
				<IconButton
					onClick={resetTimer}
					icon={<RiRefreshLine />}
					title={t('buttons.reset_btn')}
					aria-label={t('buttons.reset_btn')}
					fontSize="2rem"
					rounded="full"
				/>

				<Button
					onClick={toggleRunning}
					rightIcon={running ? <RiPauseFill /> : <RiPlayFill />}
					minW="115px"
					variant="solid"
					children={running ? t('buttons.stop_btn') : t('buttons.play_btn')}
				/>

				<IconButton
					onClick={showControls}
					variant="outline"
					borderWidth="2px"
					icon={<RiEditBoxFill />}
				/>
			</ButtonGroup>
		</>
	)
}

/**
 * Checks if the passed time is valid for this component
 * @param {Number} time
 * @return {Boolean}
 */
const checkTimeValue = (time) => {
	// Check if stored state is invalid
	if (!time || typeof time !== 'number' || time < MIN_TIME || time > MAX_TIME)
		return false

	return true
}
