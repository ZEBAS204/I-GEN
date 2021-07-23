import { configureStore } from '@reduxjs/toolkit'

// Import Reducers
import updateUIReducer from './reducer_updateUI'

// Add reducers
export default configureStore({
	reducer: {
		updateUI: updateUIReducer,
	},
})
