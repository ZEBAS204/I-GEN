import { useState, useRef } from 'react'
import { Grid, Box, Button, Input, Heading, Text } from '@chakra-ui/react'
import { RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri'
import { useLifecycles, useUpdateEffect } from 'react-use'
import { useAppContext } from '../../layouts/AppContext'

const NumSelector = ({ onSelect = () => {}, time = 0, min = 0, max = 59 }) => {
	const [picker, setPicked] = useState({
		next: min + 1,
		current: min,
		prev: max,
	})

	const increment = () => changeTime(picker.current + 1)
	const decrement = () => changeTime(picker.current - 1)

	const changeTime = (current) => {
		if (typeof current !== 'number') current = picker.current
		if (current >= max + 1) current = min
		if (current <= min - 1) current = max

		setPicked({
			next: current === max ? min : current + 1,
			current: current,
			prev: current === min ? max : current - 1,
		})
	}

	//* Return selected time to parent
	useUpdateEffect(() => onSelect(picker.current), [picker.current])

	//* Update if parent change time
	useUpdateEffect(() => changeTime(time), [time])

	//* Restore time from parent
	useLifecycles(() => time && changeTime(time))

	const ArrowButton = (props) => (
		<Button variant="ghost" size="xs" w="90%" {...props} />
	)
	const NumText = ({ children }) => <Text fontSize="lg">{children}</Text>

	return (
		<Box
			display="flex"
			flexDir="column"
			alignItems="center"
			bgGradient="linear(to-t, blackAlpha.400, transparent, blackAlpha.400)"
			borderRadius="20px"
			gap={2}
			p={3}
		>
			<ArrowButton as={RiArrowUpSLine} onClick={increment} />
			<NumText>{picker.next}</NumText>
			<Input
				type="number"
				variant="filled"
				fontWeight="bold"
				textAlign="center"
				w="90%"
				value={picker.current}
				onChange={(e) => changeTime(parseInt(e.target.value) || 0)}
			/>
			<NumText>{picker.prev}</NumText>
			<ArrowButton as={RiArrowDownSLine} onClick={decrement} />
		</Box>
	)
}

export default function TimePicker() {
	const { time, changeTime } = useAppContext()

	const [hours, setHours] = useState(null)
	const [minutes, setMinutes] = useState(null)
	const [seconds, setSeconds] = useState(null)

	const updateHours = (e) => setHours(e)
	const updateMinutes = (e) => setMinutes(e)
	const updateSeconds = (e) => setSeconds(e)

	/*
	 * Will save the last converted time.
	 * Force React to allways get the last
	 * updated states
	 */
	const newTime = useRef(null)

	useUpdateEffect(() => {
		// Calculate new time every render
		const totalTime = hours * 3600 + minutes * 60 + seconds
		newTime.current = totalTime
	}, [hours, minutes, seconds])

	//* Restore saved values storage
	//* Save selected time
	useLifecycles(
		() => {
			if (!time) return

			setSeconds(Math.floor((time % 3600) % 60))
			setMinutes(Math.floor(Math.floor((time % 3600) / 60)))
			setHours(Math.floor(time / 3600))
		},
		() => newTime.current && changeTime(newTime.current)
	)

	const PresetButton = (props) => (
		<Button
			variant="outline"
			sx={{
				border: '2px solid',
			}}
			{...props}
		>
			{props.preset}
		</Button>
	)

	return (
		<>
			<Heading size="md" textAlign="center">
				Set time
			</Heading>
			<br />
			<Grid
				templateColumns="repeat(3, 1fr)"
				textAlign="center"
				gap={[4, 8]}
				p={[4, 8]}
			>
				<p>Hours</p>
				<p>Minutes</p>
				<p>Seconds</p>
				<NumSelector time={hours} onSelect={updateHours} max={99} />
				<NumSelector time={minutes} onSelect={updateMinutes} />
				<NumSelector time={seconds} onSelect={updateSeconds} />
				<PresetButton
					preset="01:00:00"
					onClick={() => {
						updateHours(1)
						updateMinutes(0)
						updateSeconds(0)
					}}
				/>
				<PresetButton
					preset="00:30:00"
					onClick={() => {
						updateHours(0)
						updateMinutes(30)
						updateSeconds(0)
					}}
				/>
				<PresetButton
					preset="00:10:00"
					onClick={() => {
						updateHours(0)
						updateMinutes(10)
						updateSeconds(0)
					}}
				/>
			</Grid>
		</>
	)
}
