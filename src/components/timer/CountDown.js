/**
 * Used with CountDownControls.js
 */

import React, { useState, useEffect, useRef } from 'react'
import { Flex, Box, Spacer, Text } from '@chakra-ui/react'

// Default remaining time to add if no saved time is provided by the parent
const DEF_TIME = 10000

export default function CountDown({ savedTime, parentRunning, speak }) {
	const [totalTime, setTotalTime] = useState(DEF_TIME)
	const [secondsRemaining, setSecondsRemaining] = useState(DEF_TIME)

	const secondsToDisplay = secondsRemaining % 60
	const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60
	const minutesToDisplay = minutesRemaining % 60
	const hoursToDisplay = (minutesRemaining - minutesToDisplay) / 60

	const resetTimer = () => {
		setSecondsRemaining(totalTime)
	}
	useInterval(
		() => {
			if (secondsRemaining > 0) {
				setSecondsRemaining(secondsRemaining - 1)
			} else {
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

	return (
		<>
			<Flex spacing={4} direction="row">
				<Box shadow="md">
					<Text>HS</Text>
					<Text>{twoDigits(hoursToDisplay)}</Text>
				</Box>
				<Spacer />
				<Box shadow="md">
					<Text>MIN</Text>
					<Text>{twoDigits(minutesToDisplay)}</Text>
				</Box>
				<Spacer />
				<Box shadow="md">
					<Text>SEC</Text>
					<Text>{twoDigits(secondsToDisplay)}</Text>
				</Box>
			</Flex>
			<br />
			<button onClick={resetTimer} type="button">
				Reset
			</button>
		</>
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
			let id = setInterval(tick, delay)
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
