/**
 * Used with CountDown.js
 */

import React, { useState, useEffect, useRef } from 'react'

import {
	Flex,
	Box,
	Text,
	// Number counter
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
} from '@chakra-ui/react'

export default function CountDownControls({ parentCallback, savedTime }) {
	const [seconds, setSeconds] = useState(() =>
		savedTime ? Math.floor((savedTime % 3600) % 60) : 0
	)
	const [minutes, setMinutes] = useState(() =>
		savedTime ? Math.floor((savedTime % 3600) / 60) : 10
	)
	const [hours, setHours] = useState(() =>
		savedTime ? Math.floor(savedTime / 3600) : 0
	)

	/*
	 * Will save the last converted time.
	 *	Without this, whe force React to allways get the last
	 *	updated states. Nice trick eh?
	 */
	const newTime = useRef(null)

	useEffect(() => {
		// Will update newTime in every render
		// Calculate new time in seconds
		const timeToSeconds =
			parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)

		newTime.current = timeToSeconds
	}, [hours, minutes, seconds])

	useEffect(
		() => {
			return () => {
				// Callback new time set to parent only on component dismount
				if (newTime.current && newTime.current !== savedTime)
					parentCallback(newTime.current)
			}
		},
		[
			//* Only run on unmount
		]
	)

	// Editable controls object
	return (
		<Flex direction="row">
			<Box shadow="md">
				<NumberInput
					size="lg"
					maxW={32}
					min={0}
					max={59}
					defaultValue={hours}
					onBlur={(e) => setHours(e.target.value)}
					allowMouseWheel
				>
					<NumberInputField />
					<NumberInputStepper>
						<NumberIncrementStepper />
						<NumberDecrementStepper />
					</NumberInputStepper>
				</NumberInput>
				<Text align="center">HS</Text>
			</Box>
			<Box shadow="md">
				<NumberInput
					size="lg"
					maxW={32}
					min={0}
					max={59}
					defaultValue={minutes}
					onBlur={(e) => setMinutes(e.target.value)}
					allowMouseWheel
				>
					<NumberInputField />
					<NumberInputStepper>
						<NumberIncrementStepper />
						<NumberDecrementStepper />
					</NumberInputStepper>
				</NumberInput>
				<Text align="center">MIN</Text>
			</Box>
			<Box shadow="md">
				<NumberInput
					size="lg"
					maxW={32}
					min={0}
					max={59}
					defaultValue={seconds}
					onBlur={(e) => setSeconds(e.target.value)}
					allowMouseWheel
				>
					<NumberInputField />
					<NumberInputStepper>
						<NumberIncrementStepper />
						<NumberDecrementStepper />
					</NumberInputStepper>
				</NumberInput>
				<Text align="center">SEC</Text>
			</Box>
		</Flex>
	)
}
