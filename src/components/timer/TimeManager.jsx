import {
	useState,
	useEffect,
	cloneElement,
	useMemo,
	memo,
	useCallback,
} from 'react'
import { useInterval } from 'react-use'

import { useAppContext } from '@layouts/AppContext'
import { useTimerContext } from './TimerContext'
import { wrapContext } from '../contexts/contextWrapper'

/** Default fallback of the remaining time if not time is provided (10min) */
const defaultTime = 600

//* Function that avoid re-renders from the context props
const contextProps = () => {
	// Memoize callback and prevent re-renders of the button when not needed
	const { generateWord } = useCallback(useAppContext(), [])

	return {
		generateWord,
	}
}

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

const TimeManager = memo(({ generateWord, children }) => {
	const { time, isRunning, reset } = useTimerContext()

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
		[totalTime]
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
	}, [time])

	const [parentRunning, setParentRunning] = useState(isRunning)
	useEffect(() => setParentRunning(() => isRunning), [isRunning])

	// Allow parent to reset timer
	const resetTimer = () => setSecondsRemaining(totalTime)
	useEffect(() => resetTimer(), [reset])

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
})

export default wrapContext(TimeManager, contextProps)
