import { configureStore } from '@reduxjs/toolkit'

// Import Reducers
import updateUIReducer from './updateUI.reducer'

// Add reducers
export default configureStore({
	reducer: {
		updateUI: updateUIReducer,
	},
	// In production devTools will be disabled
	// devTools: process.env.NODE_ENV === 'development' ? true : false,
})
