import { Heading } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { TimeManager, CountDown } from './CountDown'

export default function DesktopTimer() {
	const { t } = useTranslation()
	const currentColor = 'blue'

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
