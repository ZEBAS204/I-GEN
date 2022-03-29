import localforage from 'localforage'
import Logger from './logger'
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
		;(async () => {
			// When getting keys, we need to wait until
			// localforage is ready before doing anything
			localforage.ready().then(() => {
				getData(key)
					.then((value) => {
						setStoredValue(value)
						Logger.info(`Got value from "${key}"`, value)
					})
					.catch((err) => {
						Logger.error(`Error getting stored value from "${key}"`, err)
						return initialValue
					})
			})
		})()
	}, [initialValue, storedValue, key])

	/** Set value */
	const set = (value) => {
		;(async function () {
			setData(key, value)
				.then(() => {
					setStoredValue(value)
					Logger.info(`Set value to "${key}"`, value)
				})
				.catch((err) => {
					Logger.error(`Error setting the key "${key}"`, err)
					return initialValue
				})
		})()
	}

	/** Removes value from local storage */
	const remove = () => {
		;(async function () {
			remData(key)
				.then(() => {
					setStoredValue(null)
					Logger.info(`Removed value from "${key}"`)
				})
				.catch((err) =>
					Logger.error(`Error deleting the stored value from "${key}"`, err)
				)
		})()
	}

	return [storedValue, set, remove]
}

export { setData, getData, remData, clearData, localforage, useLocalForage }
