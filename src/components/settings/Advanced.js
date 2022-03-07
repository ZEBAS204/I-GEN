import { useState, useEffect } from 'react'
import { getData, setData, clearData } from '../../utils/appStorage'
import { useTranslation } from 'react-i18next'
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

const modalsIds = {
	resetConfig: 1,
	sw: 2,
}

export default function Advanced() {
	const { t } = useTranslation()

	const [useDebug, setDebug] = useState(Logger.getLevel() === 0 ? true : false)
	const [useSW, setSW] = useState(false)

	const [selectedModal, setOpenModal] = useState(0)
	const { isOpen, onOpen, onClose } = useDisclosure({
		onClose: () => setOpenModal(0),
	})
	const openModal = (modal = 0) => {
		setOpenModal(modal)
		onOpen()
	}

	const restoreSettings = () =>
		// If user accepted, clear ALL stored data (local,session,etc) excluded SW cache
		clearData()
			.then((document.location.href = '/'))
			.catch(() => {})

	const toggleDebugMode = () =>
		setDebug((prevVal) => {
			const lvl = !prevVal ? 0 : 3
			Logger.setLevel(lvl, true)

			return !prevVal
		})

	const toggleSW = async () => {
		// Save setting in a const so doesn't get overwrite when toggling
		const enabled = !useSW
		setSW(enabled)
		setData('opt-in-serviceworker', enabled)

		// If user op-out remove all registered service workers and remove saved cache
		if (!navigator.serviceWorker || !window.caches) return
		if (!enabled) {
			await Promise.all([
				// Remove all cache
				caches.keys().then((c) => c.forEach((c) => caches.delete(c))),

				// Unregister all service workers
				navigator.serviceWorker
					.getRegistrations()
					.then((workers) => workers.forEach((sw) => sw.unregister())),
			]).catch((err) => console.error(err))
		}
	}

	useEffect(() => {
		;(async () => {
			await getData('opt-in-serviceworker').then((SW) =>
				setSW(SW ? true : false)
			)
		})()
	}, [])

	const Prompt = ({ header, body, okOnClick = () => {} }) => (
		<AlertDialog
			motionPreset="slideInBottom"
			onClose={onClose}
			isOpen={isOpen}
			isCentered
		>
			<AlertDialogOverlay />

			<AlertDialogContent>
				<AlertDialogHeader>{header}</AlertDialogHeader>
				<AlertDialogBody>{body}</AlertDialogBody>
				<AlertDialogFooter>
					<Button colorScheme="gray" onClick={onClose}>
						No
					</Button>
					<Button
						colorScheme="red"
						bg="red.400"
						ml={3}
						onClick={() => {
							okOnClick()
							onClose()
						}}
					>
						Yes
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)

	return (
		<>
			<Heading size="md">{t('settings.service_worker')}</Heading>
			<br />
			<Stack direction="row">
				<Heading size="sm">Use service worker</Heading>
				<Spacer />
				<Switch
					onChange={() => (useSW ? openModal(modalsIds.sw) : toggleSW())}
					isChecked={useSW}
				/>
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
			<Divider />
			<br />
			<Button
				colorScheme="red"
				bg="red.400"
				variant="solid"
				onClick={() => openModal(modalsIds.resetConfig)}
			>
				<Text>Restore default settings</Text>
			</Button>
			{selectedModal === modalsIds.resetConfig ? (
				<Prompt
					header="Restore default settings"
					body={
						<>
							<Text>
								Are you sure you want to reset to default all of your settings?
								every single one of them?
							</Text>
							<Text color="red.400">
								* Note: This will make the page refresh
							</Text>
						</>
					}
					okOnClick={restoreSettings}
				/>
			) : selectedModal === modalsIds.sw ? (
				<Prompt
					header="Disable Service Worker Usage"
					body={
						<>
							<Text>Are you sure you want to disable the service worker?</Text>
							<Text color="red.400">
								* Disabling it will make the page load slower and will not be
								able to work without internet connection
							</Text>
						</>
					}
					okOnClick={toggleSW}
				/>
			) : (
				<></>
			)}
		</>
	)
}
