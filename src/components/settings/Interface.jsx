import { useState, useCallback, memo } from 'react'
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

import { useAppContext } from '@layouts/AppContext'
import { wrapContext } from '@contexts/contextWrapper'
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

const Interface = ({ nounLang, adjLang, setNounLang, setAdjLang }) => {
	const { t, i18n } = useTranslation()

	const [wordsLang, setDisplayLang] = useState(
		nounLang === adjLang ? nounLang : 'custom'
	)

	const setWordsLang = (lang) => {
		setDisplayLang(lang)
		if (lang === 'custom') return

		setNounLang(lang)
		setAdjLang(lang)
	}

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
					value={wordsLang}
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

const contextProps = () => {
	const { nounLang, adjLang } = useAppContext()
	const { setNounLang, setAdjLang } = useCallback(useAppContext(), [])

	return { nounLang, adjLang, setNounLang, setAdjLang }
}

export default wrapContext(memo(Interface), contextProps)
