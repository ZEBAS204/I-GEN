import {
	Box,
	Button,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useMedia } from 'react-use'

import { useLocalForage } from '@utils/appStorage'
import { ReactComponent as ScrollAnimation } from '@assets/icons/scroll.svg'

export default function ScrollMessage() {
	const { t } = useTranslation()
	const isSmallDisplay = useMedia('(max-width: 800px)')
	const [wasShown, setWasShown] = useLocalForage('scroll_message_shown', true)

	const handleClick = () => {
		setWasShown(true)
	}

	if (wasShown || !isSmallDisplay) return <></>

	return (
		<AlertDialog isOpen={true} blockScrollOnMount isCentered>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader
						fontSize="lg"
						fontWeight="bold"
						textAlign="center"
						_light={{
							color: 'black',
						}}
					>
						{t('common.tutorial_scroll_message')}
					</AlertDialogHeader>

					<AlertDialogBody display="flex" justifyContent="center">
						<Box as={ScrollAnimation} w="full" h="8em" aria-hidden />
					</AlertDialogBody>

					<AlertDialogFooter justifyContent="center">
						<Button flexGrow=".25" onClick={handleClick}>
							{t('buttons.ok_btn')}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	)
}
