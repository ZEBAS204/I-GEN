import {
	createContext,
	useState,
	useContext,
	useMemo,
	useCallback,
} from 'react'
import { useLocalForage } from '@utils/appStorage'

// Constants
const DEF_TIME = 600 // 10 min
const MIN_TIME = 0
const MAX_TIME = 359999 // 99h 59m 59s

/**
 * Checks if the passed time is valid for this component
 * @param {Number} time
 * @return {Boolean}
 */
const checkTimeValue = (time) => {
	// Check if stored state is invalid
	if (!time || typeof time !== 'number' || time < MIN_TIME || time > MAX_TIME)
		return false

	return true
}

// create context
const TimerContext = createContext()

const TimerContextProvider = ({ children }) => {
	const [speak, setSpeak] = useLocalForage('tts_enabled', false)
	const [time, setTime] = useLocalForage('countdown_time', DEF_TIME)
	const [isRunning, setRunning] = useState(false)
	const [reset, setReset] = useState(false)

	const stopTimer = useCallback(
		() => isRunning && setRunning(false),
		[isRunning]
	)

	// memoize the full context value
	const contextValue = useMemo(
		() => ({
			time,
			changeTime: (e) => checkTimeValue(e) && setTime(e),

			speak,
			toggleSpeak: (e) => (e ? setSpeak(e) : setSpeak(!speak)),

			isRunning,
			toggleRunning: () => setRunning((e) => !e),

			reset,
			sendReset: () => setReset((e) => !e),
		}),
		[time, setTime, isRunning, setRunning, reset, setReset, stopTimer]
	)

	return (
		// the Provider gives access to the context to its children
		<TimerContext.Provider value={contextValue}>
			{children}
		</TimerContext.Provider>
	)
}

// context consumer hook
/**
 * @param {number} time Time for countdown
 * @param {boolean} isRunning Set if time is running
 * @param {function} setTime
 * @param {function} setRunning
 * @param {boolean} reset
 * @param {function} sendReset
 * @returns {React.context<TimerContext>}
 */
const useTimerContext = () => {
	// get the context
	const context = useContext(TimerContext)

	// if `undefined`, throw an error
	if (context === undefined) {
		throw new Error('useTimerContext was used outside of its Provider')
	}

	return context
}

export { TimerContextProvider, TimerContext, useTimerContext }
