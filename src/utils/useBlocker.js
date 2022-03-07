/**
 * These hooks re-implement the now removed useBlocker and usePrompt hooks in 'react-router-dom'.
 * Thanks to @rmorse and @piecyk https://github.com/remix-run/react-router/issues/8139#issuecomment-953816315
 * Source: https://gist.github.com/rmorse/426ffcc579922a82749934826fa9f743
 */
import { useContext, useEffect, useCallback } from 'react'
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom'
/**
 * Blocks all navigation attempts. This is useful for preventing the page from
 * changing until some condition is met, like saving form data.
 *
 * @param  blocker
 * @param  when
 * @see https://reactrouter.com/api/useBlocker
 */
export function useBlocker(blocker, when = true) {
	const { navigator } = useContext(NavigationContext)

	useEffect(() => {
		if (!when) return

		const unblock = navigator.block((tx) => {
			const autoUnblockingTx = {
				...tx,
				retry() {
					// Automatically unblock the transition so it can play all the way
					// through before retrying it. TODO: Figure out how to re-enable
					// this block if the transition is cancelled for some reason.
					unblock()
					tx.retry()
				},
			}

			blocker(autoUnblockingTx)
		})

		return unblock
	}, [navigator, blocker, when])
}
/**
 * Prompts the user with an Alert before they leave the current screen.
 *
 * @param  message
 * @param  when
 */
export function usePrompt(message, when = true) {
	const blocker = useCallback(
		(tx) => {
			// eslint-disable-next-line no-alert
			if (window.confirm(message)) tx.retry()
		},
		[message]
	)

	useBlocker(blocker, when)
}
