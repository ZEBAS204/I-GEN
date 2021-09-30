import { getData, setData } from './appStorage'
import Logger from './logger'

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

export default async function defaultSettings() {
	const isElectron = () => {
		const check = checkElectronInstance()
		setData('electron', check)
	}

	const setDefaults = () => {
		// Import default settings from assets
		const defaults = require('../assets/defaultUserSettings.json')

		// Loop all the settings from the default json and compare
		// with the stored ones if they exist and their type match
		defaults.forEach(async (def) => {
			let isEmpty = false

			if (!def) isEmpty = true
			if (!('key' in def) || def.key === undefined) isEmpty = true
			if (!('type' in def) || def.type === undefined) isEmpty = true
			if (!('value' in def) || def.value === undefined) isEmpty = true

			// Compare the user value with the default ones
			if (!isEmpty) {
				// Get stored value from user
				const storedValue = await getData(def.key)

				if (storedValue !== null) {
					if (typeof storedValue === def.type) {
						Logger.log(['DS', 'info'], `Expected value of key "${def.key}"`)
					} else {
						// Key is stored but the expected type is wrong
						// Set key to default value
						Logger.log(
							['DS', 'info'],
							`Value type of key "${def.key}" is unexpected! Restoring key default value.`
						)
						setData(def.key, def.value)
					}
				} else {
					// Key not exist
					Logger.log(
						['DS', 'info'],
						`"${def.key}" key not found. Creating a new one...`
					)
					setData(def.key, def.value)
				}
			} else {
				Logger.log(
					['DS', 'warn'],
					'Unexpected object passed in defaults settings'
				)
			}
		})
	}

	// Run in start
	isElectron()
	setDefaults()
}
