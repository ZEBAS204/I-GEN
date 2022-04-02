import { lazy, Suspense } from 'react'
import { Flex, Center } from '@chakra-ui/react'

import { useAppContext } from '../layouts/AppContext'
import TimerMode from './timer'
import GenerateButton from '../components/common/GenerateButton'
const WordGenerator = lazy(() => import('../components/WordGenerator'))

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
						<TimerMode />
					</Center>
				)}
			</Flex>
			<GenerateButton />
		</>
	)
}
