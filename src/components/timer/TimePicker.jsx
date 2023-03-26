import { useState, useRef, useId } from 'react'
import {
	Icon,
	Grid,
	Flex,
	Button,
	Input,
	Text,
	Heading as CHeading,
} from '@chakra-ui/react'
import { useMedia, useLifecycles, useUpdateEffect } from 'react-use'
import { RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri'
import { useTranslation } from 'react-i18next'
import { useTimerContext } from './TimerContext'

const Heading = (props) => (
	<CHeading as="label" size="md" {...props}>
		{props.children}
	</CHeading>
)

const ArrowButton = ({ asIcon, onClick }) => (
	<Button variant="ghost" size="xs" w="90%" onClick={onClick} tabIndex="-1">
		<Icon as={asIcon} w={6} h={6} />
	</Button>
)

const NumText = ({ children }) => (
	<Text fontSize="lg" aria-hidden>
		{children}
	</Text>
)

const PresetButton = ({ preset, ...props }) => (
	<Button variant="outline" border="2px solid" {...props}>
		{preset}
	</Button>
)

export const NumSelector = ({
	onSelect = () => {},
	id,
	time = 0,
	min = 0,
	max = 59,
}) => {
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
			current,
			next: current === max ? min : current + 1,
			prev: current === min ? max : current - 1,
		})
	}

	//* Return selected time to parent
	useUpdateEffect(() => onSelect(picker.current), [picker.current])

	//* Update if parent change time
	useUpdateEffect(() => {
		if (time !== picker.current) changeTime(time)
	}, [time])

	//* Restore time from parent
	useLifecycles(() => time && changeTime(time))

	return (
		<Flex
			w="clamp(1%, 6em, 100%)"
			flexDir="column"
			alignItems="center"
			bgGradient="linear(to-t, gray.200, transparent, gray.200)"
			_dark={{
				bgGradient: 'linear(to-t, blackAlpha.400, transparent, blackAlpha.400)',
			}}
			borderRadius="20px"
			mx={2}
			gap={2}
			p={4}
		>
			<ArrowButton asIcon={RiArrowUpSLine} onClick={increment} />
			<NumText>{picker.next}</NumText>
			<Input
				id={id}
				type="number"
				variant="filled"
				fontWeight="bold"
				textAlign="center"
				w="100%"
				bg="blackAlpha.100"
				_dark={{
					bg: 'whiteAlpha.100',
				}}
				min={min}
				max={max}
				value={picker.current}
				onChange={(e) => changeTime(parseInt(e.target.value) || 0)}
			/>
			<NumText>{picker.prev}</NumText>
			<ArrowButton asIcon={RiArrowDownSLine} onClick={decrement} />
		</Flex>
	)
}

export const TimePickerContent = () => {
	const { t } = useTranslation()
	const { time, changeTime } = useTimerContext()
	const hourId = useId()
	const minId = useId()
	const secId = useId()

	const [hours, setHours] = useState(null)
	const [minutes, setMinutes] = useState(null)
	const [seconds, setSeconds] = useState(null)

	const updateHours = (e) => setHours(e)
	const updateMinutes = (e) => setMinutes(e)
	const updateSeconds = (e) => setSeconds(e)
	const updateTime = ({ hours = 0, minutes = 0, seconds = 0 }) => {
		setHours(hours)
		setMinutes(!hours && !minutes && !seconds ? 10 : minutes) // default to 10 minutes if no time is specified
		setSeconds(seconds)
	}

	/*
	 * Will save the lastest converted time.
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

	return (
		<>
			<Grid templateColumns="repeat(3, 1fr)" gap="5%" justifyItems="center">
				<Heading htmlFor={hourId}>{t('timer.hours')}</Heading>
				<Heading htmlFor={minId}>{t('timer.minutes')}</Heading>
				<Heading htmlFor={secId}>{t('timer.seconds')}</Heading>
				<NumSelector id={hourId} time={hours} onSelect={updateHours} max={99} />
				<NumSelector id={minId} time={minutes} onSelect={updateMinutes} />
				<NumSelector id={secId} time={seconds} onSelect={updateSeconds} />
			</Grid>
			<Flex
				aria-labelledby="timerpresets"
				as="section"
				direction="column"
				gap={6}
			>
				<Heading id="timerpresets">{t('timer.presets')}</Heading>
				<PresetButton
					preset="01:00:00"
					onClick={() => updateTime({ hours: 1 })}
				/>
				<PresetButton
					preset="00:30:00"
					onClick={() => updateTime({ minutes: 30 })}
				/>
				<PresetButton
					preset="00:10:00"
					onClick={() => updateTime({ minutes: 10 })}
				/>
			</Flex>
		</>
	)
}

export default function TimePicker() {
	const isSmallDisplay = useMedia('(max-width: 800px)')

	if (isSmallDisplay)
		return (
			<Flex
				flexDirection="column"
				gap="1em"
				py={10}
				textAlign="center"
				color="#000"
				_dark={{
					color: '#fff',
				}}
			>
				<TimePickerContent />
			</Flex>
		)

	return (
		<Grid
			w="100%"
			templateColumns="60% 30%"
			templateRows="1fr"
			gap="10%"
			py={10}
			textAlign="center"
			color="#000"
			_dark={{
				color: '#fff',
			}}
		>
			<TimePickerContent />
		</Grid>
	)
}
