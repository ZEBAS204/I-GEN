import { useState, useEffect, lazy, Suspense } from 'react'
import { Flex, Center } from '@chakra-ui/react'

import { getData } from '../utils/appStorage'
import { useAppContext } from '../layouts/AppContext'
import TimerMode from './timer'
import GenerateButton from '../components/common/GenerateButton'
const WordGenerator = lazy(() => import('../components/WordGenerator'))

export default function Home() {
	const [ttsDisabled, setTTSDisabled] = useState(false)
	const { isInMobileView } = useAppContext()

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
					<WordGenerator disableTTS={ttsDisabled} />
				</Suspense>
				{!isInMobileView && (
					<Center flexDirection="column">
						<TimerMode />
					</Center>
				)}
			</Flex>
			<GenerateButton />
		</>
	)
}
