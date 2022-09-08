import { createContext, useState, useContext, useMemo } from 'react'
import { useLocalForage } from '@utils/appStorage'

// Create context
const AppContext = createContext()

const AppContextProvider = ({ children }) => {
	// the value that will be given to the context
	const [isTTSEnabled, setTTSEnabled] = useLocalForage('tts_enabled', false)
	const [nounLang, setNounLang] = useLocalForage('lang_noun', 'en')
	const [adjLang, setAdjLang] = useLocalForage('lang_adj', 'en')

	const [gen, sendGenerate] = useState(false)

	// memoize the full context value
	const contextValue = useMemo(
		() => ({
			gen,
			generateWord: () => sendGenerate((e) => !e),

			isTTSEnabled,
			toggleSpeak: (e) => (e ? setTTSEnabled(e) : setTTSEnabled(!isTTSEnabled)),

			// Languages
			nounLang,
			adjLang,
			setNounLang,
			setAdjLang,
		}),
		[
			gen,
			sendGenerate,
			isTTSEnabled,
			setTTSEnabled,
			nounLang,
			adjLang,
			setNounLang,
			setAdjLang,
		]
	)

	return (
		// the Provider gives access to the context to its children
		<AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
	)
}

// context consumer hook
/**
 * @param {boolean} gen Dummy boolean to trigger word generation
 * @param {boolean} isTTSEnabled If TTS is enabled
 * @param {?string} nounLang Noun language to use when generating wordsets
 * @param {?string} adjLang Adjective language to use when generating wordsets
 * @param {function} generateWord
 * @param {function} toggleSpeak
 * @param {function} setNounLang Set noun language to use
 * @param {function} setAdjLang Set adjective language to use
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
