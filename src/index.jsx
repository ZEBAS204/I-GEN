import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { useRegisterSW } from 'virtual:pwa-register/react'

import Logger from '@utils/logger'
import { localforage } from '@utils/appStorage'

import '@utils/i18n'
import defaultSettings from '@utils/defaultSettings'
import App from './App'

const log = Logger.getLogger('index')
const EnsureDataLoad = () => {
	const [loaded, setLoaded] = useState(false)
	const { updateServiceWorker, needRefresh } = useRegisterSW({
		onRegistered(r) {
			log.info(['index'], 'SW Registered: ', r)
		},
		onRegisterError(error) {
			log.error(['index'], 'Service worker registration error', error)
		},
		onOfflineReady() {
			log.info(['index'], 'Service worker offline ready')
		},
	})

	useEffect(() => {
		// Set Default User Settings if they are not defined
		localforage
			.ready()
			.then(() => defaultSettings())
			.catch((err) => console.error(err))
			.finally(() => {
				const $ = document.getElementById('loading-screen')
				if ($) $.hidden = 'none'
				setLoaded(true)
			})
	}, [])

	if (!loaded) return <></>

	return <App swUpdate={needRefresh} registration={updateServiceWorker} />
}

// Change document title if in dev environment
if (import.meta.env.DEV) document.title = '[DEV] ' + document.title

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<EnsureDataLoad />
	</StrictMode>
)
