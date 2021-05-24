import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 *
 * @param {string} key
 * @param {*} value
 * @param {boolean} success Success storign given key
 */
const setData = async (key, value) => {
	let success // Initialize var
	try {
		const jsonValue = JSON.stringify(value)
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
 *
 * @param {string} key
 * @returns {*} key storaged value or null if non existent
 */
const getData = async (key) => {
	try {
		const value = await AsyncStorage.getItem(key)
		// value previously stored
		return value !== null ? value : null
	} catch (e) {
		// error reading value
		return null
	}
}

/**
 *
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
