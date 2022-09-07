import {
	Box,
	Text,
	Link,
	Icon,
	Heading,
	Stack,
	Select as ChakraSelect,
	Spacer,
} from '@chakra-ui/react'
import { RiExternalLinkLine } from 'react-icons/ri'
import { useTranslation } from 'react-i18next'

import { useLocalForage } from '@utils/appStorage'
import {
	supportedLanguages,
	supportedWordsLanguages,
} from '@utils/supportedLanguages'

const Select = (props) => (
	<Box shadow="base" borderRadius="md">
		<ChakraSelect variant="filled" {...props}>
			{props.children}
		</ChakraSelect>
	</Box>
)

export default function Interface() {
	const { t, i18n } = useTranslation()

	const [wordsLang, setWordsLang] = useLocalForage('settings.words_lang', 'en')
	const [nounLang, setNounLang] = useLocalForage('settings.lang_noun', 'en')
	const [adjLang, setAdjLang] = useLocalForage('settings.lang_adj', 'en')

	return (
		<>
			<Stack direction="row" alignItems="center">
				<Heading size="md">{t('settings.language')}</Heading>
				<Spacer />

				<Select
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
			</Stack>
			<Stack direction="row" alignItems="center" mt={4}>
				<Heading size="md">{t('settings.language_words')}</Heading>
				<Spacer />
				<Select
					value={
						// Get current language without country code
						wordsLang
					}
					onChange={(e) => setWordsLang(e.target.value)}
				>
					{
						// Get all available languages
						supportedWordsLanguages.map((lang, key) => (
							<option value={lang.code} key={`wordlng-${lang}-${key}`}>
								{t(`languages.${lang.code}`)}
							</option>
						))
					}
					<option value="custom">{t('settings.language_word_custom')}</option>
				</Select>
			</Stack>

			{
				// Allow to manually set language options when language="custom"
				wordsLang === 'custom' && (
					<Stack direction="row" mt={2}>
						<Stack direction="column" alignItems="center">
							<Heading size="sm" color="whiteAlpha.800">
								{t('common.noun')}
							</Heading>
							<Select
								variant="filled"
								value={nounLang}
								onChange={(e) => setNounLang(e.target.value)}
							>
								{supportedWordsLanguages.map((lang, key) => (
									<option value={lang.code} key={`wordlng-${lang}-${key}`}>
										{t(`languages.${lang.code}`)}
									</option>
								))}
							</Select>
						</Stack>
						<Spacer />
						<Stack direction="column" alignItems="center">
							<Heading size="sm" color="whiteAlpha.800">
								{t('common.adjective')}
							</Heading>
							<Select
								variant="filled"
								value={adjLang}
								onChange={(e) => setAdjLang(e.target.value)}
							>
								{
									// Get all available languages
									supportedWordsLanguages.map((lang, key) => (
										<option value={lang.code} key={`wordlng-${lang}-${key}`}>
											{t(`languages.${lang.code}`)}
										</option>
									))
								}
							</Select>
						</Stack>
					</Stack>
				)
			}
			<Text pt={2}>
				<Link href="#" isExternal>
					{t('settings.language_contribute')} <Icon as={RiExternalLinkLine} />
				</Link>
			</Text>
		</>
	)
}
