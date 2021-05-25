import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Create a new data item into LocalStorage
 * @param {string} key Name of the value to store with be accessed by
 * @param {*} value Any value to give to the key
 * @param {boolean} success Success storign given key
 */
const setData = async (key, value) => {
	let success // Initialize var
	try {
		const jsonValue = JSON.stringify(value) // Saved as an object
		await AsyncStorage.setItem(key, jsonValue)
		success = true
	} catch (e) {
		// saving error
		success = false
	} finally {
		return success
	}
}

/**
 * Get a stored data item from LocalStorage (if exists)
 * @param {string} key Name of the data to accesses
 * @returns {*} key storaged value or null if non existent
 */
const getData = async (key) => {
	try {
		const value = await AsyncStorage.getItem(key)
		// convert the value if exist into an object,
		// so we can preserve the original value type
		const objValue = JSON.parse(value)

		return value !== null ? objValue : null
	} catch (e) {
		// error reading value
		return null
	}
}

/**
 * Removed a given key name from LocalStorage (if exists)
 * @param {string} key
 * @returns Success deleting given key
 */
const remData = async (key) => {
	let success // Initialize var
	try {
		const value = await AsyncStorage.getItem(key)
		if (value !== null) {
			window.localStorage.removeItem(key)
		}
		success = true
	} catch (e) {
		// saving error
		success = false
	} finally {
		return success
	}
}

export { setData, getData, remData }
