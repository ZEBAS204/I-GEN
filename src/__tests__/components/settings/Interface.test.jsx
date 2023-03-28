import { vi, describe, test, expect, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import { ChakraProvider } from '@chakra-ui/react'
import '@utils/i18n' // i18n must be imported
import { AppContext } from '@layouts/AppContext'
import {
	supportedLanguages,
	supportedWordsLanguages,
} from '@utils/supportedLanguages'
import Interface from '@components/settings/Interface'

const context_values = {
	gen: false,
	generateWord: () => {},
	// Settings
	isWordDisplayFlip: false,
	toggleWordFlip: () => {},
	// Languages
	nounLang: 'en',
	adjLang: 'en',
	setNounLang: () => {},
	setAdjLang: () => {},
}

const renderInterface = () =>
	render(
		<ChakraProvider>
			<AppContext.Provider value={context_values}>
				<Interface />
			</AppContext.Provider>
		</ChakraProvider>
	)

const renderInterfaceWithCustomLangs = () => {
	const _render = render(
		<ChakraProvider>
			<AppContext.Provider value={context_values}>
				<Interface />
			</AppContext.Provider>
		</ChakraProvider>
	)

	// Second select box should be words language
	const InterfaceLanguageSelect = screen.getAllByRole('combobox')[1]

	// Select custom language to display the two new selection boxes
	fireEvent.change(InterfaceLanguageSelect, {
		target: { value: 'custom' },
	})

	return _render
}

afterEach(() => {
	vi.fn().mockReset()
})

describe('Interface settings', () => {
	test('Should render', () => {
		renderInterface()

		const Language = screen.getByText('settings.language')
		expect(Language).toBeDefined()

		const WordLanguage = screen.getByText('settings.language_words')
		expect(WordLanguage).toBeDefined()

		const ContributeLink = screen.getByText('settings.language_contribute')
		expect(ContributeLink).toBeDefined()

		// All supported interface languages must be as options
		supportedLanguages.forEach((lang) => {
			expect(screen.getByText(lang.name)).toBeDefined()
		})

		// All supported word languages must be as options
		supportedWordsLanguages.forEach((lang) => {
			expect(screen.getByText(`languages.${lang.code}`)).toBeDefined()
		})
		expect(screen.getByText('settings.language_word_custom')).toBeDefined()
	})

	test('Should render and flip words display', () => {
		const SPY_wordFlip = vi.spyOn(context_values, 'toggleWordFlip')

		renderInterfaceWithCustomLangs()

		const Noun = screen.getByText('common.noun')
		expect(Noun).toBeDefined()

		const Adjective = screen.getByText('common.adjective')
		expect(Adjective).toBeDefined()

		const WordFlipButton = screen.getByRole('checkbox', {
			title: 'settings.language_word_flip',
		})
		fireEvent.click(WordFlipButton)

		expect(SPY_wordFlip).toHaveBeenCalled()
	})

	test('Should change words language', () => {
		const SPY_nounLang = vi.spyOn(context_values, 'setNounLang')
		const SPY_adjLang = vi.spyOn(context_values, 'setAdjLang')

		renderInterfaceWithCustomLangs()

		// Interface language, words language (custom), nouns language and adjectives language
		expect(screen.getAllByRole('combobox').length).toBe(4)

		const AdjLangSelector = screen.getAllByRole('combobox')[2]
		const NounLangSelector = screen.getAllByRole('combobox')[3]

		const langLength = supportedWordsLanguages.length
		const nounSelectedLang = supportedWordsLanguages[langLength - 1].code
		const adjSelectedLang = supportedWordsLanguages[langLength - 2].code

		fireEvent.change(NounLangSelector, {
			target: { value: nounSelectedLang },
		})

		fireEvent.change(AdjLangSelector, {
			target: { value: adjSelectedLang },
		})

		expect(SPY_nounLang).toHaveBeenCalledWith(nounSelectedLang)
		expect(SPY_adjLang).toHaveBeenCalledWith(adjSelectedLang)
	})
})
