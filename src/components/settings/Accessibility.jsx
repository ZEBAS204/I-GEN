import { useState, useEffect, useCallback, memo } from 'react'
import { setData } from '@utils/appStorage'
import {
	Box,
	Switch,
	Stack,
	Spacer,
	Heading,
	Button,
	Select,
	Tooltip,
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	Input,
} from '@chakra-ui/react'

import { useTranslation } from 'react-i18next'
import { useAppContext } from '@layouts/AppContext'
import { wrapContext } from '@contexts/contextWrapper'
import TTS from '@utils/tts'

const VolumeSlider = () => {
	const [volume, setVolume] = useState(TTS._volume * 100)
	const [displayVolumeTooltip, setDisplayVolumeTooltip] = useState(false)
	const changeVolume = (newVol) => setData('tts_volume', newVol)

	return (
		<Slider
			focusThumbOnChange={false} // Prevent stealing focus when using the input from bellow
			onChange={(val) => setVolume(val)}
			onChangeStart={() => setDisplayVolumeTooltip(true)}
			onChangeEnd={(val) => {
				const decVol = val / 100 // The real value goes from 0 to 1
				changeVolume(decVol)
				TTS._volume = decVol // TTS class static var
				setDisplayVolumeTooltip(false)
			}}
			defaultValue={TTS._volume * 100}
			min={1}
			max={100}
			step={1}
		>
			<SliderTrack>
				<SliderFilledTrack />
			</SliderTrack>
			<Tooltip
				isOpen={displayVolumeTooltip}
				label={volume}
				placement="top"
				hasArrow
			>
				<SliderThumb />
			</Tooltip>
		</Slider>
	)
}

const RateSldier = () => {
	const [speed, setSpeed] = useState(TTS._speed * 100)
	const [displaySpeedTooltip, setDisplaySpeedTooltip] = useState(false)
	const changeSpeed = (newSpeed) => setData('tts_speed', newSpeed)

	return (
		<Slider
			onChange={(vel) => setSpeed(vel)}
			onChangeStart={() => setDisplaySpeedTooltip(true)}
			onChangeEnd={(vel) => {
				const decVel = vel / 100 // The real value goes from 0 to 1
				changeSpeed(decVel)
				TTS._rate = decVel // TTS class static var
				setDisplaySpeedTooltip(false)
			}}
			defaultValue={TTS._rate * 100}
			min={1}
			max={100}
			step={1}
		>
			<SliderTrack>
				<SliderFilledTrack />
			</SliderTrack>
			<Tooltip
				isOpen={displaySpeedTooltip}
				label={speed}
				placement="top"
				hasArrow
			>
				<SliderThumb />
			</Tooltip>
		</Slider>
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
		<Stack direction="row" alignItems="center">
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
		</Stack>
	)
}

const Accessibility = ({ isTTSEnabled, toggleSpeak }) => {
	const { t } = useTranslation()

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
			<Stack direction="row" alignItems="center">
				<Heading size="md">{t('settings.tts')} (TTS)</Heading>
				<Spacer />
				<Switch onChange={toggleTTS} isChecked={useTTS} />
			</Stack>

			<br />

			<Box shadow="base" borderRadius="md">
				<Select
					variant="filled"
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
			</Box>

			<br />
			<hr />
			<br />

			<Stack direction="column" px={3} gap={5}>
				<Stack direction="column">
					<Heading size="sm">{t('settings.tts_volume')}</Heading>
					<VolumeSlider />
					<Stack color="gray.400" direction="row">
						<Heading size="xs">{t('settings.tts_lower')}</Heading>
						<Spacer />
						<Heading size="xs">{t('settings.tts_higher')}</Heading>
					</Stack>
				</Stack>
				<Stack direction="column">
					<Heading size="sm">{t('settings.tts_rate')}</Heading>
					<RateSldier />
					<Stack color="gray.400" direction="row">
						<Heading size="xs">{t('settings.tts_slower')}</Heading>
						<Spacer />
						<Heading size="xs">{t('settings.tts_faster')}</Heading>
					</Stack>
				</Stack>
			</Stack>

			<br />

			<InputTest />
		</>
	)
}

const contextProps = () => {
	const { isTTSEnabled, toggleSpeak } = useCallback(useAppContext(), [])
	return { isTTSEnabled, toggleSpeak }
}

export default wrapContext(memo(Accessibility), contextProps)
