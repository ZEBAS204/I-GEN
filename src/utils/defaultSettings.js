import { getData, setData } from './appStorage'

function checkElectronInstance() {
	// Renderer process
	if (
		typeof window !== 'undefined' &&
		typeof window.process === 'object' &&
		window.process.type === 'renderer'
	) {
		return true
	}

	// Main process
	if (
		typeof process !== 'undefined' &&
		typeof process.versions === 'object' &&
		!!process.versions.electron
	) {
		return true
	}

	// Detect the user agent when the `nodeIntegration` option is set to true
	if (
		typeof navigator === 'object' &&
		typeof navigator.userAgent === 'string' &&
		navigator.userAgent.indexOf('Electron') >= 0
	) {
		return true
	}

	return false
}

export default async function defaultSettings() {
	const isElectron = () => {
		const check = checkElectronInstance()
		setData('electron', check)
	}

	const setDefaults = async () => {
		// Import default settings from assets
		const defaults = require('../assets/defaultUserSettings.json')

		// Loop all the settings from the default json and compare
		// with the stored ones if they exist and their type match
		defaults.forEach(async (def) => {
			// Get stored value from user
			const storedValue = await getData(def.key)

			console.info(storedValue, typeof storedValue)

			// Compare the user value with the default ones
			if (storedValue !== null) {
				if (typeof storedValue === def.type) {
					console.info('Everything okay!', def.key)
				} else {
					// They key is stored but the expected type is wrong
					// Set key to default value
					console.info('Unexpected value of key ', def.key)
					setData(def.key, def.value)
				}
			} else {
				// Key not exist
				console.info(`Not found "${def.key}" creating a new one...`)
				setData(def.key, def.value)
			}
		})
	}

	// Run in start
	isElectron()
	setDefaults()
}
