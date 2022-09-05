import { lazy, Suspense } from 'react'
import { Flex } from '@chakra-ui/react'
import GenerateButton from '@components/common/GenerateButton'
import DesktopTimer from '@components/timer/DesktopTimer'
import { LoadingAnimationContainer } from '@components/common/LoadingAnimation'

const WordGenerator = lazy(() => import('@components/WordGenerator'))

export default function Home() {
	return (
		<Flex as="section" direction="column" align="center">
			<Suspense
				fallback={
					<LoadingAnimationContainer
						min-height="15em"
						transform="scale(0.7)"
						transformOrigin="bottom"
					/>
				}
			>
				<WordGenerator />
			</Suspense>
			<GenerateButton />
			<DesktopTimer />
		</Flex>
	)
}
