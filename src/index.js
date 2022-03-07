import { StrictMode, Suspense, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorkerRegistration'

// Redux
import { Provider } from 'react-redux'
import store from './redux/store'

import Logger from './utils/logger'
import { localforage, getData } from './utils/appStorage'

import './utils/i18n'
import defaultSettings from './utils/defaultSettings'

import App from './App'

function EnsureDataLoad() {
	const [loaded, setLoaded] = useState(false)
	const [swUpdate, setSWUpdate] = useState(false)
	const [waitingWorker, setWaitingWorker] = useState(null)

	// FIXME: not properly registered on load event
	useEffect(() => {
		Logger.log(['SW', 'info'], 'Registering Service Worker...')

		// Set Default User Settings if they are not defined
		localforage
			.ready()
			.then(async () => {
				//Enable Service Worker if user opt in.
				getData('opt-in-serviceworker').then((isEnabled) => {
					if (isEnabled ?? true) {
						serviceWorker.register({
							onUpdate: (registration) => {
								setSWUpdate(true)
								setWaitingWorker(registration.waiting)
							},
						})
					} else {
						Logger.log(['SW', 'info'], 'User opt-out of service worker.')
					}
				})
			})
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

ReactDOM.render(
	<StrictMode>
		<Suspense fallback={<></>}>
			<Provider store={store}>
				<EnsureDataLoad />
			</Provider>
		</Suspense>
	</StrictMode>,
	document.getElementById('root')
)
