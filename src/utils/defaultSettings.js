import { getData, setData } from './appStorage'

// * https://github.com/cheton/is-electron
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

/**
 *
 * @param {Boolean} forceOverwrite If true, instead of the value check will overwrite and change all values to the defaults ones
 */
export default async function defaultSettings(forceOverwrite = false) {
	const isElectron = () => {
		const check = checkElectronInstance()
		setData('electron', check)
	}

	const setDefaults = async (overwrite) => {
		// Import default settings from assets
		const defaults = require('../assets/defaultUserSettings.json')

		// If all settings should be set to their defaults values
		const _overwrite = overwrite
		// Loop all the settings from the default json and compare
		// with the stored ones if they exist and their type match
		let int = 0
		defaults.forEach(async (def) => {
			int++
			// Get stored value from user
			const storedValue = await getData(def.key)

			// Compare the user value with the default ones
			// if _overwrite is true, will skip all checks and set defaults
			if (storedValue !== null && !_overwrite) {
				if (typeof storedValue === def.type) {
					console.info(`[DS-${int}] Everything okay!`, { key: def.key })
				} else {
					// They key is stored but the expected type is wrong
					// Set key to default value
					console.info(`[DS-${int}] Unexpected value of key `, { key: def.key })
					setData(def.key, def.value)
				}
			} else {
				// Key not exist
				console.info(`[DS-${int}] Not found "${def.key}" creating a new one...`)
				setData(def.key, def.value)
			}
		})
	}

	// Run in start
	isElectron()
	setDefaults(typeof forceOverwrite === 'boolean' ? forceOverwrite : false)
}
