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
	const [useTTS, setTTS] = useState(false)
	const [, setVolume] = useState(1)
	const [speaking, setSpeaking] = useState(false)
	const [readText, setReadText] = useState('')
	const handleTextChange = (event) => setReadText(event.target.value)
	const { t } = useTranslation()

	// TODO: get and set values for TTS supported voices
	// TODO: TTS keeps speaking after unloading the element. Will trigger a memory leak warning

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
	}, [])

	return (
		<>
			<Heading>{t('settings.accessibility')}</Heading>
			<br />
			<Divider />
			<br />
			<Box>
				<Text>Text To Speak (TTS)</Text>
				<Stack direction="row">
					<Text>
						Enable TTS: Everytime a new set of words is generated, will
						automatically speak those words
					</Text>
					<Spacer />
					<Switch onChange={toggleTTS} isChecked={useTTS} />
				</Stack>
				<br />
				<Stack direction="row">
					<Button
						isLoading={speaking ? true : false}
						onClick={async () => {
							setSpeaking(true)
							console.log('Speaking!')
							//! I don't see any danger here, React already cares about this
							new TTS(readText.length >= 1 ? readText : undefined, true).say(
								() => {
									setSpeaking(false)
									console.log('No more speaking :(')
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
				<Select
					variant="filled"
					onChange={(e) => {
						console.log('=============', e) //! TODO: Remove temp log
					}}
				>
					{
						// Get all available voices from the OS
						// As the default value will use the first voice item in array
						TTS._voices.map((voice, val = -1) => {
							val++
							return (
								<option value={val} key={val}>
									{voice.name}
								</option>
							)
						})
					}
				</Select>
				<br />
				<Input
					variant="outline"
					value={readText}
					onChange={handleTextChange}
					placeholder="Write anything you want the TTS to say here!"
				/>
			</Box>
		</>
	)
}
