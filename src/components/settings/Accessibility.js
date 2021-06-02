import React, { useState, useEffect } from 'react'
import { getData, setData } from '../../utils/appStorage'
import {
	Box,
	Text,
	Divider,
	Switch,
	Stack,
	Spacer,
	Heading,
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	Button,
	Select,
	Input,
} from '@chakra-ui/react'

import { RiVoiceprintFill } from 'react-icons/ri'

import { useTranslation } from 'react-i18next' // Translations
import TTS from '../../utils/tts' // TTS Class

export default function Accessibility() {
	const { t } = useTranslation()

	const [useTTS, setTTS] = useState(false)
	const [onlyTimerTTS, toggleOnlyTimerTTS] = useState(false)
	const [, setVolume] = useState(1)
	const [speaking, setSpeaking] = useState(false)
	const [readText, setReadText] = useState('')

	const handleTextChange = (event) => setReadText(event.target.value)

	// TODO: get and set values for TTS supported voices
	// TODO: bind only timer mode option to a config

	const toggleTTS = () => {
		if (typeof useTTS === 'boolean') {
			const newValue = !useTTS
			setTTS(newValue)
			setData('tts_enabled', newValue)
		}
	}

	useEffect(() => {
		;(async () => {
			await getData('tts_enabled').then((tts) => {
				setTTS(tts !== null ? tts : false)
			})
			await getData('tts_volume').then((vol) => {
				setVolume(vol !== null && typeof vol === 'number' ? vol : 1)
			})
		})()

		/*
		 * returned function will be called on component unmount
		 * https://stackoverflow.com/a/53465182
		 */
		return () => {
			// Just stop TTS if speaking, already has check inside the class function
			TTS.stop()
		}
	}, [])

	return (
		<>
			<Heading size="md">{t('settings.tts')}</Heading>
			<br />
			<Heading size="sm">Enable TTS</Heading>
			<Stack direction="row">
				<Text>
					Everytime a new set of words is generated, will automatically speak
					those words
				</Text>
				<Spacer />
				<Switch onChange={toggleTTS} isChecked={useTTS} />
			</Stack>
			<br />
			<Divider />
			<br />
			<Heading size="sm">Timer Mode ONLY</Heading>
			<Stack direction="row">
				<Text>
					Will only be used on Timer Mode, so you don't have to lost focus
					reading the next pair of words :D
				</Text>
				<Spacer />
				<Switch
					onChange={toggleOnlyTimerTTS}
					isChecked={onlyTimerTTS}
					isDisabled={!useTTS}
				/>
			</Stack>
			<br />
			<Divider />
			<br />
			<Stack direction="row">
				<Button
					isLoading={speaking ? true : false}
					onClick={async () => {
						setSpeaking(true)
						//! I don't see any danger here, React already cares about this
						new TTS(readText.length >= 1 ? readText : undefined, true).say(
							() => {
								setSpeaking(false)
							}
						)
					}}
					colorScheme="blue"
					variant="solid"
				>
					Test
				</Button>
				<Spacer />
				<Slider
					focusThumbOnChange={false} // Prevent stealing focus when using the input from bellow
					onChangeEnd={(val) => {
						const decVol = val / 100 // The real value goes from 0 to 1
						setVolume(val)
						TTS._volume = decVol // TTS class static var
						console.log(`Showed vol: ${val}\nReal vol: ${decVol}`)
					}}
					defaultValue={TTS._volume * 100}
					min={1}
					max={100}
					step={1}
				>
					<SliderTrack>
						<SliderFilledTrack />
					</SliderTrack>
					<SliderThumb boxSize={6}>
						<Box color="cornflowerblue" as={RiVoiceprintFill} />
					</SliderThumb>
				</Slider>
			</Stack>
			<br />
			<Box shadow="base">
				<Select
					variant="filled"
					onChange={(e) => TTS.changeVoice(e.target.value)}
				>
					{
						// Get all available voices from the OS
						// As the default value will use the first voice item in array
						// TODO: sometimes voices doesn't load in FF89. Only happends if is the first time loading the page and the URL is /settings.
						// TODO: works but doesn't return anything on Chrome
						TTS._voices.map((voice, val) => {
							val-- // We need to remove one so start from -1
							val++ // Now the val is 0
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
			<Input
				variant="outline"
				value={readText}
				onChange={handleTextChange}
				placeholder="Write anything you want the TTS to say here!"
			/>
		</>
	)
}
