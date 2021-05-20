import { getData, setData } from '../utils/appStorage'

// chakra-ui Framework
import { createStandaloneToast } from '@chakra-ui/react' // Toasts

async function DownloadToastMessage() {
	console.info('TOAST: LOADED DownloadToast.js')
	const electron = !!(await getData('electron')) // Not using Electron
	const prevInteracted = !!(await getData('toastInteracted')) // User interacted previously

	if (!electron && !prevInteracted) {
		console.info('TOAST: Creating Standalone Toast in DOM...')
		const toast = createStandaloneToast()
		toast({
			title: 'DOWNLOAD APP',
			description:
				'This page is also available for desktop completely offline to download 😉',
			position: 'top-right',
			variant: 'left-accent',
			duration: null,
			isClosable: true,
			onCloseComplete: () => {
				setData('toastInteracted', true) // Will not show the toast again
			},
		})
	} else
		console.info(
			'TOAST: User already Interacted with the toast.\nOR IS RUNNING IN ELECTRON'
		)
}

export default DownloadToastMessage
