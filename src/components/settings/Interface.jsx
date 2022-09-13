import { useState, useCallback, memo } from 'react'
import {
	Box,
	Text,
	Link,
	Icon,
	IconButton,
	Heading,
	Stack,
	Select as ChakraSelect,
	Spacer,
} from '@chakra-ui/react'
import {
	RiExternalLinkLine,
	RiArrowLeftRightLine as FlipIcon,
} from 'react-icons/ri'
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

const Interface = ({
	nounLang,
	adjLang,
	setNounLang,
	setAdjLang,
	isWordDisplayFlip,
	toggleWordFlip,
}) => {
	const { t, i18n } = useTranslation()

	const [wordsLang, setDisplayLang] = useState(
		nounLang === adjLang ? nounLang : 'custom'
	)

	const setWordsLang = (lang) => {
		setDisplayLang(lang)
		if (lang === nounLang && lang === adjLang) return
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
				//* Allow to manually set language options when language="custom"
				wordsLang === 'custom' && (
					<Stack
						direction="row"
						mt={2}
						justify="space-around"
						alignItems="center"
					>
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

						<IconButton
							size="lg"
							rounded="full"
							variant="solid"
							icon={<FlipIcon />}
							title={t('settings.language_word_flip')}
							aria-label={t('settings.language_word_flip')}
							colorScheme={isWordDisplayFlip ? 'green' : 'red'}
							onClick={() => toggleWordFlip()}
						/>

						<Stack direction="column" alignItems="center">
							<Heading size="sm" color="whiteAlpha.800">
								{t('common.noun')}
							</Heading>
							<Select
								variant="filled"
								value={nounLang}
								onChange={(e) => setNounLang(e.target.value)}
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
	const { nounLang, adjLang, isWordDisplayFlip, toggleWordFlip } =
		useAppContext()
	const { setNounLang, setAdjLang } = useCallback(useAppContext(), [])

	return {
		nounLang,
		adjLang,
		setNounLang,
		setAdjLang,
		isWordDisplayFlip,
		toggleWordFlip,
	}
}

export default wrapContext(memo(Interface), contextProps)
