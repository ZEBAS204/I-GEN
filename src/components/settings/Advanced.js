import React, { useState, useEffect } from 'react'
import { getData, setData, clearData } from '../../utils/appStorage'
import Logger from '../../utils/logger'
import {
	Text,
	Divider,
	Switch,
	Stack,
	Spacer,
	Heading,
	Button,
	// Alert dialog
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	useDisclosure,
} from '@chakra-ui/react'

import { useTranslation } from 'react-i18next' // Translations

export default function Advanced() {
	const { t } = useTranslation()

	const [useDebug, setDebug] = useState(false)
	const [useSW, setSW] = useState(true)

	// Restore default settings
	const { isOpen, onOpen, onClose } = useDisclosure()
	const cancelRef = React.useRef()

	const restoreSettings = () => {
		// If user accepted, clear ALL stored data (local,session,etc) excluded SW cache
		try {
			clearData()
		} catch (err) {
			Logger.log(['Settings', 'error'], 'Error trying to clear Page Storages')
		} finally {
			// Then just redirect to the main page path
			document.location.href = '/'
		}
	}

	const toggleDebugMode = () => {
		const use = !useDebug
		setDebug(use)
		setData('dev_mode', use)

		// Force update of logger
		Logger.isLoggerEnabled(true)
	}

	const toggleSW = () => {
		// Save setting in a const so doesn't get overwrite when toggling
		const enabled = !useSW
		setSW(enabled)
		setData('opt-in-serviceworker', enabled)

		// If user op-out remove all registered service workers and remove saved cache
		if (!enabled) {
			;(async () => {
				try {
					// Unregister all registered service workers
					const registrations = await navigator.serviceWorker.getRegistrations()
					const unregisterPromises = registrations.map((registration) =>
						registration.unregister()
					)

					// Remove saved cache
					const allCaches = await caches.keys()
					const cacheDeletionPromises = allCaches.map((cache) =>
						caches.delete(cache)
					)

					await Promise.all([...unregisterPromises, ...cacheDeletionPromises])
				} catch (err) {
					console.error('[SW] ', err)
				}
			})()
		}
	}

	useEffect(() => {
		;(async () => {
			await getData('opt-in-serviceworker').then((SW) => {
				setSW(SW !== null ? SW : true)
			})

			await getData('dev_mode').then((dev) => {
				setDebug(dev !== null ? dev : false)
			})
		})()
	}, [])

	return (
		<>
			<Heading size="md">{t('settings.service_worker')}</Heading>
			<br />
			<Stack direction="row">
				<Heading size="sm">Use service worker</Heading>
				<Spacer />
				<Switch onChange={toggleSW} isChecked={useSW} />
			</Stack>
			<Text>Allows faster load and offline usage of the page.</Text>
			<br />
			<Divider />
			<br />
			<Heading size="md">{t('settings.debugging')}</Heading>
			<br />
			<Stack direction="row">
				<Heading size="sm">Debug Logging</Heading>
				<Spacer />
				<Switch onChange={toggleDebugMode} isChecked={useDebug} />
			</Stack>
			<Text>Print debug messages in console</Text>
			<br />
			<br />
			<Button colorScheme="red" variant="solid" onClick={onOpen}>
				Restore default settings
			</Button>
			<AlertDialog
				motionPreset="slideInBottom"
				leastDestructiveRef={cancelRef}
				onClose={onClose}
				isOpen={isOpen}
				isCentered
			>
				<AlertDialogOverlay />

				<AlertDialogContent>
					<AlertDialogHeader>Restore default settings</AlertDialogHeader>
					<AlertDialogBody>
						<Text>
							Are you sure you want to reset to default all of your settings?
							every single one of them?
						</Text>
						<Text color="red.400">* Note: This will make the page refresh</Text>
					</AlertDialogBody>
					<AlertDialogFooter>
						<Button ref={cancelRef} onClick={onClose}>
							No
						</Button>
						<Button colorScheme="red" ml={3} onClick={restoreSettings}>
							Yes
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
