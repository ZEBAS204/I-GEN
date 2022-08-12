import { Box, Text, Link, Icon, Heading, Select } from '@chakra-ui/react'
import { RiExternalLinkLine } from 'react-icons/ri'

import { useTranslation } from 'react-i18next'
import { supportedLanguages } from '../../utils/supportedLanguages'

export default function Interface() {
	const { t, i18n } = useTranslation()

	return (
		<>
			<Heading size="md">{t('settings.language')}</Heading>
			<br />
			<Heading size="sm">Select language to use</Heading>
			<Box shadow="base" borderRadius="md" marginTop={2}>
				<Select
					variant="filled"
					value={
						// Get current language without country code
						i18n.languages[0]
					}
					onChange={(e) => i18n.changeLanguage(e.target.value)}
				>
					{
						// Get all available languages
						supportedLanguages.map((lang, key) => (
							<option value={lang.code} key={`lng-${lang}-${key}`}>
								{lang.name}
							</option>
						))
					}
				</Select>
			</Box>
			<br />
			<Text>
				If you would like to contribute to translations
				{
					// TODO: Use environment variable
					' '
				}
				<Link href="#" isExternal>
					click here <Icon as={RiExternalLinkLine} />
				</Link>
			</Text>
		</>
	)
}
