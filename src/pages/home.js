import { useState, useRef, useEffect, lazy, Suspense } from 'react'
import { Flex, Center, Button } from '@chakra-ui/react'
import { RiRefreshLine } from 'react-icons/ri' // Icons

import { useTranslation } from 'react-i18next'
import { useHotkeys } from 'react-hotkeys-hook'
import { getData } from '../utils/appStorage'

import TimerMode from './timer'
const WordGenerator = lazy(() => import('../components/WordGenerator'))

export default function Home() {
	const { t } = useTranslation()
	const [ttsDisabled, setTTSDisabled] = useState(false)

	// https://stackoverflow.com/a/37950970
	// Create a reference to the generator component, so we can gain
	// access and call their methods
	const genREF = useRef(null)
	const generator = () => genREF.current?.regenerateWord()

	// Bind SPACE to generator
	const genButton = useRef(null)
	useHotkeys('space', () => genButton.current?.click(), {
		filterPreventDefault: false,
	})

	useEffect(() => {
		;(async () =>
			await getData('tts_only_timermode').then(
				(ttOnly) => ttOnly && setTTSDisabled(true)
			))()
	}, [])

	return (
		<>
			<Flex flexBasis="100%" justify="space-around">
				<Suspense fallback={<p>Loading word sets...</p>}>
					<WordGenerator ref={genREF} disableTTS={ttsDisabled} />
				</Suspense>
				<Center flexDirection="column">
					<TimerMode />
				</Center>
			</Flex>
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
		</>
	)
}
