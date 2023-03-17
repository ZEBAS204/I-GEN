import { vi, describe, test, expect, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import { ChakraProvider } from '@chakra-ui/react'
import { AppContext } from '@layouts/AppContext'
import TTS from '@utils/tts'
import Accessibility from '@components/settings/Accessibility'

vi.mock('@utils/tts')

const MOCKED_VOICES = [
	{
		default: true,
		localService: true,
		voiceURI:
			'urn:moz-tts:sapi:Microsoft David - English (United States)?en-US',
		name: 'Microsoft David - English (United States)',
		lang: 'en-US',
	},
	{
		localService: true,
		voiceURI: 'urn:moz-tts:sapi:Microsoft Mark - English (United States)?en-US',
		name: 'Microsoft Mark - English (United States)',
		lang: 'en-US',
	},
	{
		localService: true,
		voiceURI: 'urn:moz-tts:sapi:Microsoft Zira - English (United States)?en-US',
		name: 'Microsoft Zira - English (United States)',
		lang: 'en-US',
	},
	{
		localService: true,
		voiceURI: 'urn:moz-tts:sapi:Microsoft Raul - Spanish (Mexico)?es-MX',
		name: 'Microsoft Raul - Spanish (Mexico)',
		lang: 'es-MX',
	},
	{
		localService: true,
		voiceURI: 'urn:moz-tts:sapi:Microsoft Sabina - Spanish (Mexico)?es-MX',
		name: 'Microsoft Sabina - Spanish (Mexico)',
		lang: 'es-MX',
	},
	{
		localService: true,
		voiceURI:
			'urn:moz-tts:sapi:Microsoft David Desktop - English (United States)?en-US',
		name: 'Microsoft David Desktop - English (United States)',
		lang: 'en-US',
	},
	{
		localService: true,
		voiceURI:
			'urn:moz-tts:sapi:Microsoft Zira Desktop - English (United States)?en-US',
		name: 'Microsoft Zira Desktop - English (United States)',
		lang: 'en-US',
	},
	{
		localService: true,
		voiceURI:
			'urn:moz-tts:sapi:Microsoft Sabina Desktop - Spanish (Mexico)?es-MX',
		name: 'Microsoft Sabina Desktop - Spanish (Mexico)',
		lang: 'es-MX',
	},
]

const context_values = {
	gen: false,
	generateWord: () => {},
	// Settings
	isTTSEnabled: true,
	toggleSpeak: () => {},
	isWordDisplayFlip: false,
	toggleWordFlip: () => {},
	// Languages
	nounLang: 'en',
	adjLang: 'en',
	setNounLang: () => {},
	setAdjLang: () => {},
}

const renderAccessibility = () =>
	render(
		<ChakraProvider>
			<AppContext.Provider value={context_values}>
				<Accessibility />
			</AppContext.Provider>
		</ChakraProvider>
	)

afterEach(() => {
	vi.fn().mockReset()
})

describe('Accessibility settings', () => {
	test('Should render', () => {
		renderAccessibility()

		// TTS language selector
		const TTSenabledTitle = screen.getByText('settings.tts (TTS)')
		expect(TTSenabledTitle).toBeDefined()

		// Expect two sliders, voice and volume
		const allSliders = screen.getAllByRole('slider')
		expect(allSliders.length).toBe(2)

		// Rate slider
		const TTSRateSliderTitle = screen.getByText('settings.tts_rate')
		const RateSliderSlowerSubtitle = screen.getByText('settings.tts_slower')
		const RateSliderFasterSubtitle = screen.getByText('settings.tts_faster')

		expect(TTSRateSliderTitle).toBeDefined()
		expect(RateSliderSlowerSubtitle).toBeDefined()
		expect(RateSliderFasterSubtitle).toBeDefined()

		// Volume slider
		const TTSVolumeSliderTitle = screen.getByText('settings.tts_volume')
		const VolumeSliderLowerSubtitle = screen.getByText('settings.tts_lower')
		const VolumeSliderHigherSubtitle = screen.getByText('settings.tts_higher')

		expect(TTSVolumeSliderTitle).toBeDefined()
		expect(VolumeSliderLowerSubtitle).toBeDefined()
		expect(VolumeSliderHigherSubtitle).toBeDefined()
	})

	test('Should render and toggle TTS usage', () => {
		const Spy_isTTSEnabled = vi.spyOn(context_values, 'toggleSpeak')

		renderAccessibility()

		// First checkbox enables/disables TTS
		const TTSenabledCheck = screen.getByRole('checkbox')
		expect(TTSenabledCheck.checked).toBe(context_values.isTTSEnabled)

		fireEvent.click(TTSenabledCheck)

		expect(Spy_isTTSEnabled).toHaveBeenCalled()
		expect(TTSenabledCheck.checked).toBe(!context_values.isTTSEnabled)
	})

	test('Should render and swap TTS voice selector', () => {
		TTS._voices = MOCKED_VOICES

		renderAccessibility()

		const TTSVoiceSelect = screen.getByRole('combobox')
		const TTSVoicePlaceholder = screen.getByRole('option', {
			value: '',
			name: 'settings.tts_dropdown',
		})

		expect(TTSVoiceSelect).toBeDefined()
		expect(TTSVoicePlaceholder).toBeDefined()

		// Loop all voices and expect them
		MOCKED_VOICES.forEach(({ name }) => {
			expect(screen.getByText(name)).toBeDefined()
		})

		// Change voice
		fireEvent.change(TTSVoiceSelect, {
			target: { value: 2 },
		})
		expect(TTS.changeVoice).toHaveBeenCalled(2)
	})

	test('Should render and preview TTS', () => {
		const INPUT_TEST_VALUE = 'INPUT_TEST_123'

		renderAccessibility()

		const TestInputButton = screen.getByText('settings.tts_test_btn')
		const TestInput = screen.getByRole('textbox', {
			placeholder: 'settings.tts_test_input',
		})

		expect(TestInputButton).toBeDefined()
		expect(TestInput).toBeDefined()

		fireEvent.change(TestInput, { target: { value: INPUT_TEST_VALUE } })
		expect(TestInput.value).toBe(INPUT_TEST_VALUE)

		fireEvent.click(TestInputButton)
		expect(TTS.prototype.say).toHaveBeenCalled()
		expect(TTS).toHaveBeenCalledWith(INPUT_TEST_VALUE, true) // text to speak, awaitEnds callback
	})
})
