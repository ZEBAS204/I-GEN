import localforage from 'localforage'

// This will rename the database from "storage" to "Settings"
localforage.config({
	name: 'Settings',
})

/* If in development environment, use localstorage (will allow modifying saved values)
 * Also `dev` is used to return values as objects
 */
const dev = true // process.env.NODE_ENV === 'development'
const storage = dev ? localStorage : localforage

/**
 * Create a new data item into LocalStorage
 * @param {string} key Name of the value to store with be accessed by
 * @param {*} value Any value to give to the key
 * @param {boolean} success Success storign given key
 */
const setData = async (key, value) => {
	let success // Initialize var
	try {
		if (dev) {
			value = JSON.stringify(value)
		}

		await storage.setItem(key, value)
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
		const value = await storage.getItem(key)

		// storage already returns null if the key requested not exists
		return dev ? JSON.parse(value) : value
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
		await storage.removeItem(key)
		success = true
	} catch (e) {
		// saving error
		success = false
	} finally {
		return success
	}
}

/**
 * Remove all stored data
 * @returns Success deleting given key
 */
const clearData = async () => {
	let success // Initialize var
	try {
		// If in dev, we clear session and local storages
		if (dev) {
			storage.clear()
			window.sessionStorage.clear()
		} else {
			// If not, we have to clear: IndexedDB/WebSQ + session + local
			storage.clear()
			window.localStorage.clear()
			window.sessionStorage.clear()
		}

		success = true
	} catch (err) {
		// This code runs if there were any errors
		console.log(err)
		success = false
	} finally {
		return success
	}
}

export { setData, getData, remData, clearData }
