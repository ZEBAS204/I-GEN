import { getData, setData } from './appStorage'
import Logger from './logger'

export default async function defaultSettings() {
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
				let storedValue

				// Prevent malformed values from breaking when parsing
				try {
					storedValue = await getData(def.key)
				} catch (jsonError) {
					storedValue = null
				}

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

	// Run at start
	setDefaults()
}
