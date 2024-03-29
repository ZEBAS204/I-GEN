import { getData, setData } from './appStorage'
import Logger from './logger'
import defaults from '@assets/defaultUserSettings.json'

const log = Logger.getLogger('default-storage')
const logName = log.name

/*
 * Compare all of the local user settings from the default settings
 * and check if they match the scheme, otherwise restore to their default
 */
export default async function defaultSettings() {
	defaults.forEach(async (def) => {
		let isEmpty = false

		if (!def) isEmpty = true
		if (!('key' in def) || def.key === undefined) isEmpty = true
		if (!('type' in def) || def.type === undefined) isEmpty = true
		if (!('value' in def) || def.value === undefined) isEmpty = true

		//* If empty, just ignore it
		if (isEmpty) {
			log.warn([logName], 'Unexpected object passed in defaults settings')
			return
		}

		// Get stored value from user
		//* Prevent malformed values from breaking when parsing
		let storedValue
		try {
			storedValue = await getData(def.key)
		} catch (_jsonError) {
			storedValue = null
		}

		//* Key does not exist
		if (storedValue === null) {
			log.info([logName], `"${def.key}" key not found. Creating a new one...`)
			setData(def.key, def.value)
			return
		}

		//* Key is stored but the expected type is wrong
		//* Set key to it's default value
		if (typeof storedValue !== def.type) {
			log.info(
				[logName],
				`Value type of key "${def.key}" is unexpected! Restoring key default value.`
			)
			setData(def.key, def.value)
			return
		}

		//* Key type is the expected one
		log.info([logName], `Expected value of key "${def.key}"`)
		if (def.type !== 'number') return

		//* Key is a number
		//* Check min and max values for numbers
		// Key is stored but the expected type exceeds the min value
		// Set key to default value
		if ('min' in def && storedValue < def.min) {
			log.info(
				[logName],
				`Value of key "${def.key}" exceeds minimum value is unexpected! Restoring key default value.`
			)
			setData(def.key, def.value)
		}

		// Key is stored but the expected type exceeds the max value
		// Set key to default value
		if ('max' in def && storedValue > def.max) {
			log.info(
				[logName],
				`Value of key "${def.key}" exceeds maximum value is unexpected! Restoring key default value.`
			)
			setData(def.key, def.value)
		}
	})
}
