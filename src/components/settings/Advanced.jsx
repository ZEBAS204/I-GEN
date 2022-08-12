import { useState } from 'react'
import { clearData } from '../../utils/appStorage'
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
}

export default function Advanced() {
	const { t } = useTranslation()

	const [useDebug, setDebug] = useState(Logger.getLevel() === 0 ? true : false)
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
			.then(window.location.reload())
			.catch(() => {})

	const toggleDebugMode = () =>
		setDebug((prevVal) => {
			const lvl = !prevVal ? 0 : 3
			Logger.setLevel(lvl, true)

			return !prevVal
		})

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
			) : (
				<></>
			)}
		</>
	)
}
