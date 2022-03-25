/**
 * Used with CountDown.js
 */
import { useState, useEffect, useRef } from 'react'
import Sheet from 'react-modal-sheet'
import {
	useColorModeValue,
	Grid,
	Text,
	// Number Input
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
} from '@chakra-ui/react'

import { useAppContext } from '../../layouts/AppContext'
import '../../assets/scss/components/CountDownControl.scss'

const CountDownControlsMobile = () => {
	const { isTimePickerVisible, toggleTimePickerVisible } = useAppContext()

	return (
		<Sheet isOpen={isTimePickerVisible} onClose={toggleTimePickerVisible}>
			<Sheet.Container>
				<Sheet.Header />
				<Sheet.Content>{/* Your sheet content goes here */}</Sheet.Content>
			</Sheet.Container>

			<Sheet.Backdrop />
		</Sheet>
	)
}

const CountDownControls = ({ parentCallback, savedTime }) => {
	const NumBoxBG = useColorModeValue('blackAlpha.100', 'whiteAlpha.100')
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
	 * Whe force React to allways get the last
	 * updated states. Nice trick eh?
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
				// Send the new time to parent only on component dismount
				if (newTime.current && newTime.current !== savedTime)
					parentCallback(newTime.current)
			}
		},
		//* Only run on unmount
		[] // eslint-disable-line
	)

	const NumberInputBox = ({ defValue, onBlur, bottomText }) => (
		<NumberInput
			size="lg"
			shadow="md"
			maxW={32}
			min={0}
			max={59}
			defaultValue={defValue}
			onBlur={onBlur}
			inputMode="numeric"
			allowMouseWheel
		>
			<NumberInputField bg={NumBoxBG} fontSize="30px" textAlign="center" />
			<NumberInputStepper>
				<NumberIncrementStepper />
				<NumberDecrementStepper />
			</NumberInputStepper>
		</NumberInput>
	)

	return (
		<Grid
			templateColumns="1fr 1fr 1fr"
			templateRows="1fr auto"
			fontFamily="consolas"
			gap={3}
			alignItems="center"
			textAlign="center"
		>
			<NumberInputBox
				defValue={hours}
				onBlur={(e) => setHours(e.target.value)}
			/>
			<NumberInputBox
				defValue={minutes}
				onBlur={(e) => setMinutes(e.target.value)}
				bottomText="Minutes"
			/>
			<NumberInputBox
				defValue={seconds}
				onBlur={(e) => setSeconds(e.target.value)}
				bottomText="Seconds"
			/>
			<Text align="center">Hours</Text>
			<Text align="center">Minutes</Text>
			<Text align="center">Seconds</Text>
		</Grid>
	)
}

export { CountDownControls, CountDownControlsMobile }
