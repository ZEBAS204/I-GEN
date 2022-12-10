import { useEffect, useState, useCallback, useRef } from 'react'

/**
 * @typedef {object} useFetchReturn
 * @property {*} data The data returned from the request
 * @property {boolean} isError Indicates whether the request failed
 * @property {boolean} isLoading Indicates whether the request is still in progress
 * @property {function} refetch A function that can be called to manually refetch the data
 */

/**
 * @typedef {object} useFetchOptions
 * @property {boolean} [enabled=true] If the fetch will automatically run (if not, you will need to manually trigger it with `refetch` function)
 * @property {function} [onSuccess] A function that triggers after the request has been fetched successfully. The data is passed to the callback
 * @property {RequestInit} [fetchOptions={}] Options that will use the fetch function (ignored when using a function directly instead of a URL)
 */

/**
 * useFetch is a custom hook that mimics the react-query functionality.
 * This hook manages the loading state and error handling of a request using a URL or accepts a promise.
 * @param {URL|function} url A string representing the URL to fetch or a function that returns a promise
 * @param {useFetchOptions} [options] Optional configurations
 * @returns {useFetchReturn}
 */
export default function useFetch(url, options = {}) {
	const { enabled = true, onSuccess = null, fetchOptions = {} } = options

	const [data, setData] = useState()
	const [isError, setIsError] = useState(false)
	const [isLoading, setLoading] = useState(false)

	// Used to prevent state update if the component is unmounted
	const cancelRequest = useRef(false)
	const isCanceled = cancelRequest?.current ?? true

	const fetchData = useCallback(async () => {
		if (isCanceled) return
		setLoading(true)

		if (typeof url === 'string')
			return await fetch(url, fetchOptions)
				.then((res) => res.json())
				.then((data) => {
					if (isCanceled) return
					setData(data)
					setIsError(false)
					if (onSuccess) onSuccess(data)
				})
				.catch((err) => {
					console.error(`Error: ${err.message}`)
					if (!isCanceled) setIsError(true)
				})
				.finally(() => !isCanceled && setLoading(false))

		if (typeof url !== 'function')
			throw new Error('useFetch expected a URL or promise')

		await url()
			.then((data) => {
				if (isCanceled) return
				setData(data)
				setIsError(false)
				if (onSuccess) onSuccess(data)
			})
			.catch((err) => {
				console.error(`Error: ${err.message}`)
				if (!isCanceled) setIsError(true)
			})
			.finally(() => !isCanceled && setLoading(false))
	}, [url])

	useEffect(() => {
		// Do nothing if the url is not given
		if (!url) return
		cancelRequest.current = false
		if (enabled) fetchData()

		return () => {
			// Use the cleanup function for avoiding a possibly
			// state update after the component was unmounted
			cancelRequest.current = true
		}
	}, [])

	return { data, isError, isLoading, refetch: fetchData }
}
