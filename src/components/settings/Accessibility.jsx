import { useState, useEffect, useCallback, memo, useId } from 'react'
import { setData } from '@utils/appStorage'
import {
	Divider,
	Switch,
	Stack,
	Heading,
	Button,
	Tooltip,
	Slider as CSlider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	Input,
} from '@chakra-ui/react'
import { Stack as SpacedStack, Select, SmallHeading } from './_common'

import { useTranslation } from 'react-i18next'
import { useAppContext } from '@layouts/AppContext'
import { wrapContext } from '@contexts/contextWrapper'
import TTS from '@utils/tts'

const Slider = (props) => (
	<CSlider min={1} max={100} step={1} {...props}>
		<SliderTrack aria-hidden>
			<SliderFilledTrack />
		</SliderTrack>
		{props.children}
	</CSlider>
)
const SliderGuidance = ({ left, right }) => (
	<Stack
		color="gray.400"
		direction="row"
		justifyContent="space-between"
		aria-hidden
	>
		<Heading size="xs" as="h4">
			{left}
		</Heading>
		<Heading size="xs" as="h4">
			{right}
		</Heading>
	</Stack>
)

const VolumeSlider = () => {
	const { t } = useTranslation()
	const [volume, setVolume] = useState(TTS._volume * 100)
	const [displayVolumeTooltip, setDisplayVolumeTooltip] = useState(false)
	const changeVolume = (newVol) => setData('tts_volume', newVol)

	return (
		<>
			<Slider
				aria-label={t('settings.tts_volume')}
				aria-valuenow={volume}
				onChange={(val) => setVolume(val)}
				onChangeStart={() => setDisplayVolumeTooltip(true)}
				onChangeEnd={(val) => {
					const decVol = val / 100 // The real value goes from 0 to 1
					changeVolume(decVol)
					TTS._volume = decVol
					setDisplayVolumeTooltip(false)
				}}
				defaultValue={TTS._volume * 100}
			>
				<Tooltip
					isOpen={displayVolumeTooltip}
					label={volume}
					placement="top"
					hasArrow
					aria-hidden
				>
					<SliderThumb />
				</Tooltip>
			</Slider>
			<SliderGuidance
				left={t('settings.tts_lower')}
				right={t('settings.tts_higher')}
			/>
		</>
	)
}

const RateSlider = () => {
	const { t } = useTranslation()
	const [speed, setSpeed] = useState(TTS._rate * 100)
	const [displaySpeedTooltip, setDisplaySpeedTooltip] = useState(false)
	const changeSpeed = (newSpeed) => setData('tts_speed', newSpeed)

	return (
		<>
			<Slider
				aria-label={t('settings.tts_rate')}
				aria-valuenow={speed}
				onChange={(vel) => setSpeed(vel)}
				onChangeStart={() => setDisplaySpeedTooltip(true)}
				onChangeEnd={(vel) => {
					const decVel = vel / 100 // The real value goes from 0 to 1
					changeSpeed(decVel)
					TTS._rate = decVel
					setDisplaySpeedTooltip(false)
				}}
				defaultValue={TTS._rate * 100}
			>
				<Tooltip
					isOpen={displaySpeedTooltip}
					label={speed}
					placement="top"
					hasArrow
					aria-hidden
				>
					<SliderThumb />
				</Tooltip>
			</Slider>
			<SliderGuidance
				left={t('settings.tts_slower')}
				right={t('settings.tts_faster')}
			/>
		</>
	)
}

const InputTest = () => {
	const { t } = useTranslation()
	const [speaking, setSpeaking] = useState(false)
	const [readText, setReadText] = useState('')

	const handleTTStest = (event) => setReadText(event.target?.value)

	useEffect(() => {
		return () => {
			setSpeaking(false)
		}
	}, [])

	return (
		<SpacedStack>
			<Button
				variant="solid"
				size="sm"
				fontSize="small"
				px={5}
				onClick={() => {
					if (speaking) {
						setSpeaking(false)
						TTS.stop()
						return
					}

					setSpeaking(true)
					new TTS(readText.length >= 1 ? readText : undefined, true).say(() =>
						setSpeaking(false)
					)
				}}
			>
				{speaking
					? t('settings.tts_test_stop_btn')
					: t('settings.tts_test_btn')}
			</Button>
			<Input
				variant="filled"
				type="text"
				onChange={handleTTStest}
				placeholder={t('settings.tts_test_input')}
			/>
		</SpacedStack>
	)
}

const Accessibility = ({ isTTSEnabled, toggleSpeak }) => {
	const { t } = useTranslation()
	const ttsCheckboxId = useId()

	const [useTTS, setTTS] = useState(isTTSEnabled)

	const toggleTTS = () => {
		const newValue = !useTTS
		setTTS(newValue)
		toggleSpeak(newValue)
	}

	const changeVoice = (voice) => {
		if (!voice) return // If placeholder is selected, voice = empty string
		// Save selected voice index
		voice = Number(voice)
		setData('tts_voice', voice)
		TTS.changeVoice(voice)
	}

	useEffect(() => {
		return () => {
			// Just stop TTS if speaking, already has check inside the class function
			TTS.stop()
		}
	}, [])

	return (
		<>
			<SpacedStack
				as="label"
				htmlFor={ttsCheckboxId}
				heading={`${t('settings.tts')} (TTS)`}
				mt={0}
			>
				<Switch id={ttsCheckboxId} onChange={toggleTTS} isChecked={useTTS} />
			</SpacedStack>

			<Select
				mt={6}
				placeholder={t('settings.tts_dropdown')}
				onChange={(e) => changeVoice(e.target?.value)}
			>
				{
					// Get all available voices from the OS
					// As the default value will use the first voice item in array
					TTS._voices.map((voice, val) => {
						return (
							<option value={val} key={`voice-${val}`}>
								{voice.name}
							</option>
						)
					})
				}
			</Select>

			<Divider my={6} />

			<Stack direction="column" px={3} gap={5}>
				<Stack>
					<SmallHeading>{t('settings.tts_volume')}</SmallHeading>
					<VolumeSlider />
				</Stack>
				<Stack>
					<SmallHeading>{t('settings.tts_rate')}</SmallHeading>
					<RateSlider />
				</Stack>
			</Stack>
			<InputTest />
		</>
	)
}

const contextProps = () => {
	const { isTTSEnabled, toggleSpeak } = useCallback(useAppContext(), [])
	return { isTTSEnabled, toggleSpeak }
}

export default wrapContext(memo(Accessibility), contextProps)
