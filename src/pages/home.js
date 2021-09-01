import React, { useRef, useEffect } from 'react'
import { useColorModeValue, Center, Flex, Button } from '@chakra-ui/react'
import { RiRefreshLine } from 'react-icons/ri' // Icons

import WordGenerator from '../components/WordGenerator'
import { useTranslation } from 'react-i18next' // Translations
import { getData } from '../utils/appStorage'

export default function Home() {
	const bgColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')
	const { t } = useTranslation()

	// https://stackoverflow.com/a/37950970
	// Create a reference to the generator component, so we can gain
	// access and call their methods
	const genREF = useRef(null)
	const generator = () => genREF.current.regenerateWord()

	useEffect(() => {
		;(async () => {
			await getData('tts_only_timermode').then((ttOnly) => {
				if (ttOnly !== null && ttOnly) {
					genREF.current.disableTTS()
				}
			})
		})()
	}, [])

	return (
		<Center
			p={3}
			bg={bgColor}
			borderRadius="md"
			boxShadow="base"
			flexBasis="100%" // Allow to fill empty space
			className="container"
		>
			<Flex flexDirection="column">
				<WordGenerator ref={genREF} />
				<br />
				<Button
					spacing={4}
					variant="solid"
					colorScheme="blue"
					rightIcon={<RiRefreshLine />}
					onClick={generator}
					alignSelf="center"
				>
					{t('buttons.regenerate')}
				</Button>
			</Flex>
		</Center>
	)
}
