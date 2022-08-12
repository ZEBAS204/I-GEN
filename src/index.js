import React, { StrictMode, Suspense, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import * as serviceWorker from './serviceWorkerRegistration'
import '@hookstate/devtools'

import Logger from './utils/logger'
import { localforage } from './utils/appStorage'

import './utils/i18n'
import defaultSettings from './utils/defaultSettings'
import App from './App'

function EnsureDataLoad() {
	const [loaded, setLoaded] = useState(false)
	const [swUpdate, setSWUpdate] = useState(false)
	const [waitingWorker, setWaitingWorker] = useState(null)

	useEffect(() => {
		Logger.log(['SW', 'info'], 'Registering Service Worker...')

		serviceWorker.register({
			onUpdate: (registration) => {
				setSWUpdate(true)
				setWaitingWorker(registration.waiting)
			},
		})

		// Set Default User Settings if they are not defined
		localforage
			.ready()
			.then(() => defaultSettings())
			.catch((err) => console.error(err))
			.finally(setLoaded(true))
	}, [])

	if (!loaded) return <></>

	return (
		<>
			<App swUpdate={swUpdate} registration={waitingWorker} />
		</>
	)
}

// Change document title if in dev environment
if (process.env.NODE_ENV === 'development')
	document.title = '[DEV] ' + document.title

ReactDOM.createRoot(document.getElementById('root')).render(
	<StrictMode>
		<Suspense fallback={<></>}>
			<EnsureDataLoad />
		</Suspense>
	</StrictMode>
)
