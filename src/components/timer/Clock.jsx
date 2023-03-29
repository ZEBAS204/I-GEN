import { useMemo } from 'react'
import { Text, Box } from '@chakra-ui/react'
import { useTranslation, Trans } from 'react-i18next'

const TimeAlert = ({ totalTime, remainingTime, children }) => {
	const { t } = useTranslation()

	const getAlertInterval = useMemo(() => {
		// Timers less than or equal to 30 seconds
		// Play alert every 10 seconds
		if (totalTime <= 30) return 10
		// Timers less than or equal to 2 minutes
		// Play alert every 30 seconds
		if (totalTime <= 120) return 30
		// Timers less than or equal to 10 minutes
		// Play alert every 1 minute
		else if (totalTime <= 600) return 60
		// Timers less than or equal to 1 hour
		// Play alert every 10 minutes
		else if (totalTime <= 3600) return 600
		// Timers longer than 1 hour
		// Play alert every 30 minutes
		return 1800
	}, [totalTime])

	const isTimerStarted = remainingTime === totalTime - 1
	const isTimeOver = !remainingTime
	const shouldDisplayAlert =
		totalTime !== remainingTime &&
		// Always display alert if 1min or 30sec are remaining
		(remainingTime === 60 ||
			remainingTime === 30 ||
			remainingTime % getAlertInterval === 0)

	return (
		<Box
			role="alert"
			aria-live="polite"
			sx={{
				pos: 'absolute',
				w: 0,
				h: 0,
				clip: 'rect(0,0,0,0)',
			}}
		>
			{isTimerStarted && t('timer.time_started')}
			{shouldDisplayAlert && (
				<Trans
					i18nKey={isTimeOver ? 'timer.time_over' : 'timer.time_remaining'}
					values={{ time: children }}
				/>
			)}
		</Box>
	)
}

export default function wClock({
	remainingtimeToDisplay = '00:00:00',
	...rest
}) {
	return (
		<>
			<Text
				role="timer"
				fontFamily="Inter, Arial"
				bgGradient="linear(to-b, #2a71fc, #6501f9)"
				_dark={{
					bgGradient: 'linear(to-b, #5fd4ff, #634dff)',
				}}
				bgClip="text"
				fontSize="max(5em, calc(100vw/17))"
				fontWeight={700}
			>
				{remainingtimeToDisplay}
			</Text>
			<TimeAlert {...rest}>{remainingtimeToDisplay}</TimeAlert>
		</>
	)
}
