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

// Default remaining time to add if no saved time is provided (10min)
const DEF_TIME = 600

/**
 * Output numbers with leading zeros
 * @param {number} num
 * @returns {string}
 */
const toTwoDigits = (num) => String(num ?? 0).padStart(2, '0')

/**
 * If the number is not zero, returns number + type
 * Eg. num = 3, type = 's' -> returns 3s
 * @param {number} num
 * @param {string|'h'|'m'|'s'} type Time type
 * @returns {string|null}
 */
const ifExistsDisplay = (num, type) => (num ? num + type : null)

const TimeManager = ({ children }) => {
	const { time, isRunning, generateWord, reset } = useAppContext()

	const [totalTime, setTotalTime] = useState(time || DEF_TIME)
	const [secondsRemaining, setSecondsRemaining] = useState(time || DEF_TIME)

	const secondsToDisplay = secondsRemaining % 60
	const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60
	const minutesToDisplay = minutesRemaining % 60
	const hoursToDisplay = (minutesRemaining - minutesToDisplay) / 60

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

	if (!children) return <></>

	return cloneElement(children, {
		parentRunning,
		totalTime,
		remainingTime: secondsRemaining,
		hoursToDisplay,
		minutesToDisplay,
		secondsToDisplay,
	})
}

const MobileCountDown = ({
	parentRunning,
	totalTime,
	remainingTime,
	hoursToDisplay,
	minutesToDisplay,
	secondsToDisplay,
}) => {
	const { t } = useTranslation()
	const currentColor = useColorScheme()
	const fillColor = useColorModeValue('100', '600')
	const {
		isInMobileView,
		toggleRunning,
		toggleTimePickerVisible,
		isTimerVisible,
	} = useAppContext()

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

	if (!isInMobileView || !isTimerVisible) return <></>

	return (
		<Flex
			id="mobile-countdown"
			fontFamily="consolas"
			alignItems="center"
			textAlign="center"
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
					{toTwoDigits(hoursToDisplay)}:{toTwoDigits(minutesToDisplay)}:
					{toTwoDigits(secondsToDisplay)}
				</Text>
				<Text fontSize={15}>
					{_.hours || _.min || _.sec ? (
						<>
							Total {ifExistsDisplay(_.hours, 'h')}{' '}
							{ifExistsDisplay(_.min, 'm')} {ifExistsDisplay(_.sec, 's')}
						</>
					) : (
						<></>
					)}
				</Text>
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

const CountDown = ({ parentRunning, totalTime, remainingTime }) => {
	const { t } = useTranslation()
	const { toggleRunning, sendReset } = useAppContext()
	const [isPickerVisible, setPickerVisible] = useState(false)

	const handleTogglePicker = () => setPickerVisible(!isPickerVisible)

	return (
		<>
			{!isPickerVisible && (
				<Clock totalTime={totalTime} remainingTime={remainingTime} />
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
