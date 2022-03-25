import { useState, useEffect, cloneElement, useMemo } from 'react'
import { useInterval } from 'react-use'
import { useTranslation } from 'react-i18next'
import {
	useColorModeValue,
	Grid,
	GridItem,
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
 * @param {string|'h'|'m'|'s'} type Time tipe
 * @returns {string|null}
 */
const ifExistsDisplay = (num, type) => (num ? num + type : null)

const TimeManager = ({ children, reset }) => {
	const { time, isRunning, generateWord } = useAppContext()

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
				setSecondsRemaining(secondsRemaining - 1)
			else {
				generateWord()
				resetTimer()
			}
		},
		// passing null stops the interval
		parentRunning ? 1000 : null
	)

	//* Testing component
	return (
		<MobileCountDown
			parentRunning={parentRunning}
			totalTime={totalTime}
			remainingTime={secondsRemaining}
			hoursToDisplay={hoursToDisplay}
			minutesToDisplay={minutesToDisplay}
			secondsToDisplay={secondsToDisplay}
		/>
	)

	/*
	if (!children) return <></>

	return cloneElement(children, {
		parentRunning,
		totalTime,
		remainingTime: secondsRemaining,
		hoursToDisplay,
		minutesToDisplay,
		secondsToDisplay,
	})
	*/
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
	const {
		isInMobileView,
		toggleRunning,
		toggleTimePickerVisible,
		isTimerVisible,
	} = useAppContext()

	//* Allows to return memoized values of the total time
	//* without having to deal with extra arguments arguments
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

const CountDown = ({ savedTime, parentRunning, speak, reset }) => {
	const NumBoxBG = useColorModeValue('blackAlpha.100', 'whiteAlpha.100')

	const [totalTime, setTotalTime] = useState(DEF_TIME)
	const [secondsRemaining, setSecondsRemaining] = useState(DEF_TIME)

	const secondsToDisplay = secondsRemaining % 60
	const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60
	const minutesToDisplay = minutesRemaining % 60
	const hoursToDisplay = (minutesRemaining - minutesToDisplay) / 60

	// Allow parent to reset timer
	const resetTimer = () => setSecondsRemaining(totalTime)
	useEffect(() => resetTimer(), [reset]) // eslint-disable-line

	useInterval(
		() => {
			if (secondsRemaining > 0) setSecondsRemaining(secondsRemaining - 1)
			else {
				speak()
				resetTimer()
			}
		},
		// passing null stops the interval
		parentRunning ? 1000 : null
	)

	useEffect(() => {
		if (savedTime) {
			setTotalTime(savedTime)
			setSecondsRemaining(savedTime)
		}
	}, [savedTime])

	const fontSizeVariants = ['1rem', '1.5rem', '2rem', '2.5rem']
	const NumBox = ({ children }) => (
		<GridItem
			bg={NumBoxBG}
			minW={['30px', '62px']}
			paddingY={2}
			shadow="md"
			borderRadius="md"
			textShadow="0 0 1px black"
		>
			<TxtNum>{children}</TxtNum>
		</GridItem>
	)
	const TxtNum = ({ children }) => (
		<Text fontSize={fontSizeVariants}>{children || ':'}</Text>
	)

	return (
		<Grid
			templateColumns="1fr auto 1fr auto 1fr"
			templateRows="1fr auto"
			fontFamily="consolas"
			gap={3}
			alignItems="center"
			textAlign="center"
		>
			<NumBox children={toTwoDigits(hoursToDisplay)} />
			<TxtNum />
			<NumBox children={toTwoDigits(minutesToDisplay)} />
			<TxtNum />
			<NumBox children={toTwoDigits(secondsToDisplay)} />
			<Text>Hours</Text>
			<div />
			<Text>Minutes</Text>
			<div />
			<Text>Seconds</Text>
		</Grid>
	)
}

export { CountDown, TimeManager as MobileCountDown }
