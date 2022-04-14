import { Heading } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { useColorScheme } from 'src/utils/theme'
import { TimeManager, CountDown } from './CountDown'

export default function DesktopTimer() {
	const { t } = useTranslation()
	const currentColor = useColorScheme()

	return (
		<>
			<Heading
				fontSize="xx-large"
				lineHeight="2em"
				fontWeight="bold"
				color={`${currentColor}.300`}
			>
				{t('buttons.timermode')}
			</Heading>
			<TimeManager>
				<CountDown />
			</TimeManager>
		</>
	)
}
