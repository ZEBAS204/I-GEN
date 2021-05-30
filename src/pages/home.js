import React, { useRef } from 'react'
import { useColorModeValue, Center, Flex, Button } from '@chakra-ui/react'
import { IoSyncOutline } from 'react-icons/io5' // Icons

import WordGenerator from '../components/WordGenerator'
import { useTranslation } from 'react-i18next' // Translations

function Home() {
	const bgColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')

	// https://stackoverflow.com/a/37950970
	// Create a reference to the generator component, so we can gain
	// access and call their methods
	const generator = useRef()
	const { t } = useTranslation()

	return (
		<Center
			p={3}
			bg={bgColor}
			borderRadius="md"
			flexBasis="100%" // Allow to fill empty space
		>
			<Flex flexDirection="column">
				<WordGenerator ref={generator} />
				<br />
				<Button
					spacing={4}
					variant="solid"
					colorScheme="blue"
					rightIcon={<IoSyncOutline />}
					onClick={() => generator.current.regenerateWord()}
					alignSelf="center"
				>
					{t('buttons.regenerate')}
				</Button>
			</Flex>
		</Center>
	)
}

export default Home
