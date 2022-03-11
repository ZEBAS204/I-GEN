import { createContext, useState, useContext, useMemo } from 'react'

// create context
const AppContext = createContext()

const AppContextProvider = ({ children }) => {
	// the value that will be given to the context
	const [isSettingVisible, setSettingVisible] = useState(false)
	const [isTimerVisible, setTimerVisible] = useState(true)
	const [time, setTime] = useState(10000)
	const [isRunning, setRunning] = useState(false)
	const [reset, setReset] = useState(false)
	const [gen, sendGenerate] = useState(false)

	// memoize the full context value
	const contextValue = useMemo(
		() => ({
			isSettingVisible,
			toggleSettingVisible: () => setSettingVisible((e) => !e),
			gen,
			generateWord: () => sendGenerate((e) => !e),
			isTimerVisible,
			toggleTimerVisible: () => setTimerVisible((e) => !e),
			time,
			changeTime: () => setTime((e) => e),
			isRunning,
			toggleRunning: () => setRunning((e) => !e),
			reset,
			sendReset: () => setReset((e) => !e),
		}),
		[
			isSettingVisible,
			setSettingVisible,
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
		]
	)

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
