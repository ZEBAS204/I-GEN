import { Flex } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { TimerContextProvider } from './TimerContext'
import TimeManager from './TimeManager'
import CountDown from './CountDown'

export default function DesktopTimer() {
	const { t } = useTranslation()

	return (
		<Flex
			as="section"
			aria-label={t('timer.title')}
			w="100%"
			h="100%"
			p={10}
			pt={0}
			flexDir="column"
			alignItems="center"
		>
			<TimerContextProvider>
				<TimeManager>
					<CountDown />
				</TimeManager>
			</TimerContextProvider>
		</Flex>
	)
}
