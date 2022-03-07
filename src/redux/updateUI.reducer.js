import { createSlice } from '@reduxjs/toolkit'
import Logger from '../utils/logger'

/*
 ? Allows to send update signal to other components
 * The value of the data send is trivial, we only use
 * this to send an update signal to the subscribed
 * components of this event to forced them to update.
 */
export const R_updateUI = createSlice({
	// Name will become in import as updateUI+Reducer
	name: 'updateUI',
	initialState: {
		value: false,
	},
	reducers: {
		update: (state) => {
			Logger.log([`Store - updateUI`], 'Reducer called, UI update forced!')

			state.value = !state.value
		},
	},
})

// Action creators are generated for each case reducer function
export const { update } = R_updateUI.actions

export default R_updateUI.reducer
