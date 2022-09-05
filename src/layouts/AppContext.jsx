import { createContext, useState, useContext, useMemo } from 'react'
import { useLocalForage } from '@utils/appStorage'

// Create context
const AppContext = createContext()

const AppContextProvider = ({ children }) => {
	// the value that will be given to the context
	const [speak, setSpeak] = useLocalForage('tts_enabled', false)
	const [gen, sendGenerate] = useState(false)

	// memoize the full context value
	const contextValue = useMemo(
		() => ({
			gen,
			generateWord: () => sendGenerate((e) => !e),

			speak,
			toggleSpeak: (e) => (e ? setSpeak(e) : setSpeak(!speak)),
		}),
		[gen, sendGenerate, speak, setSpeak]
	)

	return (
		// the Provider gives access to the context to its children
		<AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
	)
}

// context consumer hook
/**
 * @param {function} gengenerateWord
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
