import {
	createContext,
	useState,
	useContext,
	useMemo,
	useCallback,
} from 'react'
import { useMediaQuery } from '@chakra-ui/react'
import { useEffectOnce } from 'react-use'

import { mobileViewMQ } from '../utils/constants'

// Constants
const SS_NAME = 'countdown_time' // Name of the key to use in session storage
const DEF_TIME = 600 // 10 min
const MIN_TIME = 0
const MAX_TIME = 359999 // 99h 59m 59s

// create context
const AppContext = createContext()

const AppContextProvider = ({ children }) => {
	// the value that will be given to the context
	const [isInMobileView] = useMediaQuery(mobileViewMQ)
	const [isSettingVisible, setSettingVisible] = useState(false)
	const [isTimePickerVisible, setTimePickerVisible] = useState(false)
	const [isTimerVisible, setTimerVisible] = useState(false)
	const [time, setTime] = useState(DEF_TIME)
	const [isRunning, setRunning] = useState(false)
	const [reset, setReset] = useState(false)
	const [gen, sendGenerate] = useState(false)

	const stopTimer = useCallback(
		() => isRunning && setRunning(false),
		[isRunning]
	)

	// memoize the full context value
	const contextValue = useMemo(
		() => ({
			isInMobileView,
			isSettingVisible,
			toggleSettingVisible: () => {
				stopTimer()
				setSettingVisible((e) => !e)
			},
			isTimePickerVisible,
			toggleTimePickerVisible: () => {
				stopTimer()
				setTimePickerVisible((e) => !e)
			},
			gen,
			generateWord: () =>
				!isSettingVisible && !isTimePickerVisible && sendGenerate((e) => !e),
			isTimerVisible,
			toggleTimerVisible: () => {
				stopTimer()
				setTimerVisible((e) => !e)
			},
			time,
			changeTime: (e) => setTime(e),
			isRunning,
			toggleRunning: () => setRunning((e) => !e),
			reset,
			sendReset: () => setReset((e) => !e),
		}),
		[
			isInMobileView,
			isSettingVisible,
			setSettingVisible,
			isTimePickerVisible,
			setTimePickerVisible,
			gen,
			sendGenerate,
			isTimerVisible,
			setTimerVisible,
			time,
			isRunning,
			setTime,
			setRunning,
			reset,
			setReset,
			stopTimer,
		]
	)

	useEffectOnce(() => {
		// On mount, get any saved state inside Session Storage
		try {
			if (window.sessionStorage.getItem(SS_NAME)) {
				// Save storage object
				const saved = JSON.parse(window.sessionStorage.getItem(SS_NAME))

				if (checkTimeValue(saved)) {
					setTime(parseInt(saved))
				}
			}
		} catch (access_denied) {}
	})

	/*
	console.log('%cCONTEXT UPDATED', 'color: #00ff00')
	;(() => {
		console.table({
			IS_IN_MOBILE_VIEW: [isInMobileView],
			SETTINGS_VISIBLE: [isSettingVisible],
			TIMER_VISIBLE: [isTimerVisible],
			TIMER_TIMER: [time],
			TIMER_RUNNING: [isRunning],
			TIMER_RESET: [reset],
			WORD_GENERATOR: [gen],
		})
	})()
	*/

	return (
		// the Provider gives access to the context to its children
		<AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
	)
}

// context consumer hook
/**
 * @param {boolean} isSettingVisible
 * @param {function} toggleSettingVisible
 * @param {function} gengenerateWord
 * @param {boolean} isTimerVisible
 * @param {boolean} isTimerVisible
 * @param {function} toggleTimerVisible
 * @param {number} time Time for countdown
 * @param {boolean} isRunning Set if time is running
 * @param {function} setTime
 * @param {function} setRunning
 * @param {boolean} reset
 * @param {function} sendReset
 * @param {boolean} speak
 * @returns {React.context<AppContext>}
 */
const useAppContext = () => {
	// get the context
	const context = useContext(AppContext)

	// if `undefined`, throw an error
	if (context === undefined) {
		throw new Error('useAppContext was used outside of its Provider')
	}

	return context
}

export { AppContextProvider, AppContext, useAppContext }

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
