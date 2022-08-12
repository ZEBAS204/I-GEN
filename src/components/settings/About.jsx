import { Text, Divider } from '@chakra-ui/react'

import { useTranslation } from 'react-i18next' // Translations

function About() {
	const { t } = useTranslation()

	return (
		<>
			<Text fontSize="xl">{t('settings.about')}</Text>
			<Divider />
			This project it's a blablalblablbal
		</>
	)
}

export default About
