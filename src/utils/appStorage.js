import localforage from 'localforage'

const dev = false // process.env.NODE_ENV === 'development'

// This will rename the database from "storage" to "Settings"
localforage.config({
	name: 'Settings',
	description: 'Keep track of user preferences',
	version: 1.0,
	// If in development environment, use localstorage (will allow modifying saved value with ease)
	// If not, will use [INDEXEDDB, WEBSQL, LOCALSTORAGE]
	driver: dev ? localforage.LOCALSTORAGE : undefined,
})

/**
 * Create a new data item into LocalStorage
 * @param {string} key Name of the value to store with be accessed by
 * @param {*} value Any value to give to the key
 * @param {boolean} success Success storign given key
 */
const setData = localforage.setItem

/**
 * Get a stored data item from LocalStorage (if exists)
 * @param {string} key Name of the data to accesses
 * @returns {*} key storage value or null if non existent
 */
const getData = localforage.getItem

/**
 * Removed a given key name from LocalStorage (if exists)
 * @param {string} key
 * @returns Success deleting given key
 */
const remData = localforage.removeItem

/**
 * Remove all stored data
 * @returns Success deleting given key
 */
function clearData() {
	return new Promise((resolve, reject) => {
		localforage
			.clear()
			.then(() => {
				if (localforage.driver !== localforage.LOCALSTORAGE)
					localStorage.clear()
				sessionStorage.clear()

				resolve()
			})
			.catch((err) => {
				console.error(err)
				reject(err)
			})
	})
}

export { setData, getData, remData, clearData, localforage }
