import { lazy, Suspense } from 'react'
import { Flex, Center } from '@chakra-ui/react'

import { useAppContext } from '../layouts/AppContext'
import GenerateButton from '../components/common/GenerateButton'

const WordGenerator = lazy(() => import('../components/WordGenerator'))
const TimerMode = lazy(() => import('./timer'))

export default function Home() {
	const { isInMobileView } = useAppContext()

	return (
		<>
			<Flex flexBasis="100%" justify="space-around">
				<Suspense fallback={<p>Loading word sets...</p>}>
					<WordGenerator />
				</Suspense>
				{!isInMobileView && (
					<Center flexDirection="column">
						<Suspense fallback={<p>Loading countdown...</p>}>
							<TimerMode />
						</Suspense>
					</Center>
				)}
			</Flex>
			<GenerateButton />
		</>
	)
}
