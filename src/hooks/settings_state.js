/*
 * Allows to control the state with hooks
 ? For more information see: https://hookstate.js.org/
 */

import { createState, useHookstate } from '@hookstate/core'
import { Broadcasted } from '@hookstate/broadcasted'
import { Persistence } from '@hookstate/persistence'
import { stateDefaultConfig } from './default_config'
export { none } from '@hookstate/core'

//* Create a new global task state with the current config
// If was already set, this will be ignored
const taskState = createState(stateDefaultConfig)

//* Used to prevent duplicated broadcasted states to be
//* saved in local storage if it was already attached
let wasAttached = false

/** Global State */
export function useConfigState() {
	//* This function exposes the state directly.
	//* i.e. the state is accessible directly outside of this module.
	const state = useHookstate(taskState)

	if (!wasAttached && typeof window !== 'undefined' && !taskState.promised) {
		// Allow to sync data between tabs
		taskState.attach(
			Broadcasted('settings-sync-channel', () => {
				// Attach persistence plugin (Persist data in localStorage)
				taskState.attach(Persistence('settings'))
			})
		)
		wasAttached = true
	}

	return state
}
