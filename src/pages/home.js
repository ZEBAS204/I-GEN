import { useRef, useEffect, lazy, Suspense } from 'react'
import { useColorModeValue, Center, Button } from '@chakra-ui/react'
import { RiRefreshLine } from 'react-icons/ri' // Icons

import { useTranslation } from 'react-i18next'
import { useHotkeys } from 'react-hotkeys-hook'
import { getData } from '../utils/appStorage'

const WordGenerator = lazy(() => import('../components/WordGenerator'))

export default function Home() {
	const bgColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')
	const { t } = useTranslation()

	// https://stackoverflow.com/a/37950970
	// Create a reference to the generator component, so we can gain
	// access and call their methods
	const genREF = useRef(null)
	const generator = () => genREF.current && genREF.current.regenerateWord()

	// Bind SPACE to generator
	const genButton = useRef(null)
	useHotkeys('space', () => genButton.current?.click(), {
		filterPreventDefault: false,
	})

	useEffect(() => {
		;(async () =>
			await getData('tts_only_timermode').then((ttOnly) => {
				if (ttOnly) genREF.current.disableTTS()
			}))()
	}, [])

	return (
		<Center bg={bgColor} p={3} flexBasis="100%" flexDirection="column">
			<Suspense fallback={<p>Loading word sets...</p>}>
				<WordGenerator ref={genREF} />
			</Suspense>
			<Button
				variant="solid"
				rightIcon={<RiRefreshLine />}
				alignSelf="center"
				marginY={5}
				ref={genButton}
				onClick={generator}
			>
				{t('buttons.regenerate')}
			</Button>
		</Center>
	)
}
