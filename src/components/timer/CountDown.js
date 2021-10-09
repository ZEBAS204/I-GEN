/**
 * Used with CountDownControls.js
 */
import { useState, useEffect, useRef } from 'react'
import { useColorModeValue, Grid, GridItem, Text } from '@chakra-ui/react'

// Default remaining time to add if no saved time is provided by the parent (10min)
const DEF_TIME = 10000

export default function CountDown({ savedTime, parentRunning, speak, reset }) {
	const NumBoxBG = useColorModeValue('blackAlpha.100', 'whiteAlpha.100')

	const [totalTime, setTotalTime] = useState(DEF_TIME)
	const [secondsRemaining, setSecondsRemaining] = useState(DEF_TIME)

	const secondsToDisplay = secondsRemaining % 60
	const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60
	const minutesToDisplay = minutesRemaining % 60
	const hoursToDisplay = (minutesRemaining - minutesToDisplay) / 60

	const resetTimer = () => setSecondsRemaining(totalTime)
	// Allow parent to reset timer
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
			<NumBox children={twoDigits(hoursToDisplay)} />
			<TxtNum />
			<NumBox children={twoDigits(minutesToDisplay)} />
			<TxtNum />
			<NumBox children={twoDigits(secondsToDisplay)} />
			<Text>Hours</Text>
			<div />
			<Text>Minutes</Text>
			<div />
			<Text>Seconds</Text>
		</Grid>
	)
}

/**
 * Same as setInterval but Hook focused
 * @param {*} callback
 * @param {Number} delay
 * @see https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */
function useInterval(callback, delay) {
	const savedCallback = useRef()

	// Remember the latest callback.
	useEffect(() => {
		savedCallback.current = callback
	}, [callback])

	// Set up the interval.
	useEffect(() => {
		const tick = () => savedCallback.current()

		if (delay !== null) {
			const id = setInterval(tick, delay)
			return () => clearInterval(id)
		}
	}, [delay])
}

/**
 * Output numbers with leading zeros
 * @param {Number} num
 * @returns {Number}
 * @see https://stackoverflow.com/a/2998874/1673761
 */
const twoDigits = (num) => String(num).padStart(2, '0')
