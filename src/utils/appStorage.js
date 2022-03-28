import localforage from 'localforage'
import { useState, useEffect } from 'react'

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

/**
 * React custom hook to save/restore value from localStorage using LocalForage library
 * @example
 * ```js
 * function App() {
 *  const [value, set, remove] = useLocalForage('my-key', {});
 * }
 * ```
 * @param {string} key - Unique storage key
 * @param {*} initialValue=null - Initial value
 * @returns {[any, (function(any): void), (function(): void)]}
 */
const useLocalForage = (key, initialValue = null) => {
	/**
	 * @author Junaid Atari <mj.atari@gmail.com>
	 * @link https://github.com/blacksmoke26
	 * @see https://github.com/streamich/react-use/issues/1522
	 * @since 2020-08-05
	 */
	const [storedValue, setStoredValue] = useState(initialValue)

	useEffect(() => {
		;(async function () {
			try {
				const value = await localforage.getItem(key)
				setStoredValue(value)
			} catch (err) {
				return initialValue
			}
		})()
	}, [initialValue, storedValue, key])

	/** Set value */
	const set = (value) => {
		;(async function () {
			try {
				await localforage.setItem(key, value)
				setStoredValue(value)
			} catch (err) {
				return initialValue
			}
		})()
	}

	/** Removes value from local storage */
	const remove = () => {
		;(async function () {
			try {
				await localforage.removeItem(key)
				setStoredValue(null)
			} catch (e) {}
		})()
	}

	return [storedValue, set, remove]
}

export { setData, getData, remData, clearData, localforage, useLocalForage }
