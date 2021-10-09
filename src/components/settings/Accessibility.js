import { useState, useEffect } from 'react'
import { getData, setData } from '../../utils/appStorage'
import {
	Box,
	Grid,
	Text,
	Divider,
	Switch,
	Stack,
	Spacer,
	Heading,
	Button,
	Select,
	// Sliders
	Tooltip,
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	// Input
	Input,
	InputGroup,
	InputLeftElement,
} from '@chakra-ui/react'

import { useTranslation } from 'react-i18next'
import TTS from '../../utils/tts'

export default function Accessibility() {
	const { t } = useTranslation()

	const [useTTS, setTTS] = useState(false)
	const [onlyTimerTTS, toggleOnlyTimerTTS] = useState(false)
	const [volume, setVolume] = useState(TTS._volume * 100)
	const [speed, setSpeed] = useState(TTS._speed * 100)
	const [speaking, setSpeaking] = useState(false)
	const [readText, setReadText] = useState('')

	const [displayVolumeTooltip, setDisplayVolumeTooltip] = useState(false)
	const [displaySpeedTooltip, setDisplaySpeedTooltip] = useState(false)

	const handleTTStest = (event) => setReadText(event.target.value)

	const changeVolume = (newVol) => setData('tts_volume', newVol)
	const changeSpeed = (newSpeed) => setData('tts_speed', newSpeed)

	const toggleTTS = () => {
		const newValue = !useTTS
		setTTS(newValue)
		setData('tts_enabled', newValue)
	}

	const toggleTimerModeOnly = () => {
		const newValue = !onlyTimerTTS
		toggleOnlyTimerTTS(newValue)
		setData('tts_only_timermode', newValue)
	}

	const changeVoice = (voice) => {
		if (!voice) return // If placeholder is selected, voice = empty string
		// Save selected voice index
		voice = Number(voice)
		setData('tts_voice', voice)
		TTS.changeVoice(voice)
	}

	useEffect(() => {
		;(async () => {
			await getData('tts_enabled').then((tts) => setTTS(tts ?? false))

			await getData('tts_only_timermode').then((ttOnly) =>
				toggleOnlyTimerTTS(ttOnly ?? false)
			)
		})()

		return () => {
			// Just stop TTS if speaking, already has check inside the class function
			TTS.stop()
			setSpeaking(false)
		}
	}, [])

	return (
		<>
			<Heading size="md">{t('settings.tts')}</Heading>
			<br />
			<Stack direction="row">
				<Heading size="sm">Enable TTS</Heading>
				<Spacer />
				<Switch onChange={toggleTTS} isChecked={useTTS} />
			</Stack>
			<Text>
				Everytime a new set of words is generated, will automatically speak
				those words
			</Text>

			<br />
			<Divider />
			<br />

			<Stack direction="row">
				<Heading size="sm">Timer Mode ONLY</Heading>
				<Spacer />
				<Switch
					onChange={toggleTimerModeOnly}
					isChecked={onlyTimerTTS}
					isDisabled={!useTTS}
				/>
			</Stack>
			<Text>
				Will only be used on Timer Mode, so you don't have to lost focus reading
				the next pair of words :D
			</Text>

			<br />
			<Divider />
			<br />

			<Box shadow="base" borderRadius="md">
				<Select
					variant="filled"
					placeholder="Selected Text-to-Speech voice"
					onChange={(e) => changeVoice(e.target.value)}
				>
					{
						// Get all available voices from the OS
						// As the default value will use the first voice item in array
						TTS._voices.map((voice, val) => {
							val-- // We need to remove one so start from -1
							val++ // Now val is 0
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

			<Grid
				gap={[4, null, 8, null, 20]}
				gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
			>
				<Stack direction="column">
					<Heading size="sm">Volume</Heading>
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
					<Stack color="gray.400" direction="row">
						<Heading size="xs">Lower</Heading>
						<Spacer />
						<Heading size="xs">Higher</Heading>
					</Stack>
				</Stack>
				<Stack direction="column">
					<Heading size="sm">Rate</Heading>
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
					<Stack color="gray.400" direction="row">
						<Heading size="xs">Slower</Heading>
						<Spacer />
						<Heading size="xs">Faster</Heading>
					</Stack>
				</Stack>
			</Grid>

			<br />

			<InputGroup>
				<InputLeftElement width="4rem">
					<Button
						w="53px"
						variant="solid"
						size="sm"
						onClick={() => {
							if (speaking) {
								setSpeaking(false)
								TTS.stop()
								return
							}

							setSpeaking(true)
							new TTS(readText.length >= 1 ? readText : undefined, true).say(
								() => {
									setSpeaking(false)
								}
							)
						}}
					>
						{speaking ? 'Stop' : 'Test'}
					</Button>
				</InputLeftElement>
				<Input
					pl="4rem"
					variant="filled"
					type="text"
					maxLength={140}
					onChange={handleTTStest}
					placeholder="Write anything you want the TTS to say here!"
				/>
			</InputGroup>
		</>
	)
}
