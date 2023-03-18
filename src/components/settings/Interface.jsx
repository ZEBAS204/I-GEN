import { useState, useCallback, memo } from 'react'
import { Text, Link, Icon, IconButton } from '@chakra-ui/react'
import {
	RiExternalLinkLine,
	RiArrowLeftRightLine as FlipIcon,
} from 'react-icons/ri'
import { useTranslation } from 'react-i18next'

import { useAppContext } from '@layouts/AppContext'
import { wrapContext } from '@contexts/contextWrapper'
import { Stack, SmallHeading, Select } from './_common'
import {
	supportedLanguages,
	supportedWordsLanguages,
} from '@utils/supportedLanguages'

const LanguageSelector = ({ includeCustom = false, ...props }) => {
	const { t } = useTranslation()

	return (
		<Select variant="filled" {...props}>
			{
				// Get all available languages
				supportedWordsLanguages.map((lang) => (
					<option value={lang.code} key={`wordlng-${lang.code}`}>
						{t(`languages.${lang.code}`)}
					</option>
				))
			}
			{includeCustom && (
				<option value="custom">{t('settings.language_word_custom')}</option>
			)}
		</Select>
	)
}

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
			<Stack heading={t('settings.language')} mt={0}>
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
			<Stack heading={t('settings.language_words')}>
				<LanguageSelector
					value={wordsLang}
					onChange={(e) => setWordsLang(e.target.value)}
					includeCustom={true}
				/>
			</Stack>

			{
				//* Allow to manually set language options when language="custom"
				wordsLang === 'custom' && (
					<Stack mt={2} justify="space-around">
						<Stack mt={0} direction="column">
							<SmallHeading>{t('common.adjective')}</SmallHeading>
							<LanguageSelector
								value={adjLang}
								onChange={(e) => setAdjLang(e.target.value)}
							/>
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

						<Stack mt={0} direction="column">
							<SmallHeading>{t('common.noun')}</SmallHeading>
							<LanguageSelector
								value={nounLang}
								onChange={(e) => setNounLang(e.target.value)}
							/>
						</Stack>
					</Stack>
				)
			}
			<Text pt={2}>
				<Link href={__CONTRIBUTE_TRANSLATION__} isExternal>
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
