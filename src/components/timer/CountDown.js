import { useState, useEffect, cloneElement, useMemo } from 'react'
import { useInterval } from 'react-use'
import { useTranslation } from 'react-i18next'
import {
	useColorModeValue,
	Text,
	Flex,
	Spacer,
	ButtonGroup,
	Button,
	IconButton,
	Progress,
} from '@chakra-ui/react'
import { RiTimeFill } from 'react-icons/ri'

import { useAppContext } from '../../layouts/AppContext'
import { useColorScheme } from 'src/utils/theme'
import Clock from './Clock'
import TimePicker from './TimePicker'

/** Default fallback of the remaining time if not time is provided (10min) */
const defaultTime = 600

/**
 * Converts the number to a string and add a leading zero
 * @param {number} num Number to convert
 * @returns {string} Formated number
 * @example padWithZero(3) // returns '03'
 */
const padWithZero = (num = 0) => String(num).padStart(2, '0')

/**
 * If the number is not zero, returns number it's type as strings
 * @param {number} num
 * @param {string|'h'|'m'|'s'} type Time type
 * @returns {string}
 * @example ifNotZero(3, 's') // returns '3s'
 */
const ifNotZero = (num, type) => (num ? num + type : '')

const TimeManager = ({ children }) => {
	const { time, isRunning, generateWord, reset } = useAppContext()

	const [totalTime, setTotalTime] = useState(time || defaultTime)
	const [secondsRemaining, setSecondsRemaining] = useState(time || defaultTime)

	const secondsToDisplay = secondsRemaining % 60
	const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60
	const minutesToDisplay = minutesRemaining % 60
	const hoursToDisplay = (minutesRemaining - minutesToDisplay) / 60

	//* Allows to return memoized values of the total time
	//* without having to deal with extra arguments
	const _ = useMemo(
		() => ({
			hours: hoursToDisplay,
			min: minutesToDisplay,
			sec: secondsToDisplay,
		}),
		[totalTime] // eslint-disable-line react-hooks/exhaustive-deps
	)

	const remainingtimeToDisplay = `${padWithZero(hoursToDisplay)}:${padWithZero(
		minutesToDisplay
	)}:${padWithZero(secondsToDisplay)}`

	const totalTimeToDisplay = `Total ${ifNotZero(_.hours, 'h')} ${ifNotZero(
		_.min,
		'm'
	)} ${ifNotZero(_.sec, 's')}`

	// Update total time with context
	useEffect(() => {
		setTotalTime(time)
		setSecondsRemaining(time)
	}, [time]) // eslint-disable-line react-hooks/exhaustive-deps

	const [parentRunning, setParentRunning] = useState(isRunning)
	useEffect(() => setParentRunning(() => isRunning), [isRunning]) // eslint-disable-line react-hooks/exhaustive-deps

	// Allow parent to reset timer
	const resetTimer = () => setSecondsRemaining(totalTime)
	useEffect(() => resetTimer(), [reset]) // eslint-disable-line react-hooks/exhaustive-deps

	useInterval(
		() => {
			if (parentRunning && secondsRemaining > 0)
				setSecondsRemaining((e) => e - 1)
			else {
				generateWord()
				resetTimer()
			}
		},
		// passing null stops the interval
		parentRunning ? 1000 : null
	)

	if (!children) throw Error('TimeManager component requires a children')

	return cloneElement(children, {
		parentRunning,
		totalTime,
		remainingTime: secondsRemaining,
		remainingtimeToDisplay,
		totalTimeToDisplay,
	})
}

const MobileCountDown = ({
	parentRunning = false,
	totalTime = 0,
	remainingTime = 0,
	remainingtimeToDisplay = 0,
	totalTimeToDisplay = 0,
}) => {
	const { t } = useTranslation()
	const currentColor = useColorScheme()
	const fillColor = useColorModeValue('700', '600')
	const bgColor = useColorModeValue('#d6d6d6', '#303b52')
	const {
		isInMobileView,
		toggleRunning,
		toggleTimePickerVisible,
		isTimerVisible,
	} = useAppContext()

	if (!isInMobileView || !isTimerVisible) return <></>

	return (
		<Flex
			id="mobile-countdown"
			fontFamily="consolas"
			alignItems="center"
			textAlign="center"
			bg={bgColor}
		>
			<Progress
				id="mobile-countdown-progress"
				value={totalTime - remainingTime}
				max={totalTime}
				size="xs"
				colorScheme={currentColor}
				bg={`${currentColor}.${fillColor}`}
				color={`${currentColor}.${fillColor}`}
			/>
			<div>
				<Text fontWeight="bold" fontSize="2xl" lineHeight="20px">
					{remainingtimeToDisplay}
				</Text>
				<Text fontSize={15}>{totalTimeToDisplay}</Text>
			</div>
			<Spacer />
			<ButtonGroup colorScheme={parentRunning ? 'red' : null} isAttached>
				<IconButton
					icon={<RiTimeFill />}
					onClick={toggleTimePickerVisible}
					title="Change Time"
					aria-label="Change time"
					rounded="full"
					fontSize="20px"
					disabled={parentRunning}
				/>
				<Button onClick={toggleRunning}>
					{parentRunning ? t('buttons.stop_btn') : t('buttons.play_btn')}
				</Button>
			</ButtonGroup>
		</Flex>
	)
}

const CountDown = ({
	parentRunning = false,
	totalTime = 0,
	remainingTime = 0,
	remainingtimeToDisplay = '',
	totalTimeToDisplay = '',
}) => {
	const { t } = useTranslation()
	const { toggleRunning, sendReset } = useAppContext()
	const [isPickerVisible, setPickerVisible] = useState(false)

	const handleTogglePicker = () => setPickerVisible(!isPickerVisible)

	return (
		<>
			{!isPickerVisible && (
				<Clock
					totalTime={totalTime}
					remainingTime={remainingTime}
					remainingtimeToDisplay={remainingtimeToDisplay}
					totalTimeToDisplay={totalTimeToDisplay}
				/>
			)}

			{isPickerVisible && <TimePicker />}

			<ButtonGroup colorScheme={parentRunning ? 'red' : null}>
				<Button onClick={sendReset}>{t('buttons.reset_btn')}</Button>
				<Button onClick={toggleRunning}>
					{parentRunning ? t('buttons.stop_btn') : t('buttons.play_btn')}
				</Button>
				<Button onClick={handleTogglePicker}>Edit</Button>
			</ButtonGroup>
		</>
	)
}

export { TimeManager, CountDown, MobileCountDown }
