import { Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export default function about() {
	const { t } = useTranslation()

	return <Text>{t('about.desc')}</Text>
}
