import React, { useState, useEffect } from 'react'
import { getData, setData } from '../../utils/appStorage'
import {
	Box,
	SimpleGrid,
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
	// Input
	Input,
	InputGroup,
	InputLeftElement,
} from '@chakra-ui/react'

import { RiVoiceprintFill, RiSpeedFill } from 'react-icons/ri'

import { useTranslation } from 'react-i18next' // Translations
import TTS from '../../utils/tts' // TTS Class

export default function Accessibility() {
	const { t } = useTranslation()

	const [useTTS, setTTS] = useState(false)
	const [onlyTimerTTS, toggleOnlyTimerTTS] = useState(false)
	const [, setVolume] = useState(1)
	const [, setSpeed] = useState(1)
	const [speaking, setSpeaking] = useState(false)
	const [readText, setReadText] = useState('')

	const handleTextChange = (event) => setReadText(event.target.value)

	// TODO: bind only timer mode option to a config
	// TODO: await until user end writing to update readText state

	const toggleTTS = () => {
		const newValue = !useTTS
		setTTS(newValue)
		setData('tts_enabled', newValue)
	}

	const changeVoice = (voice) => {
		// TODO: storage converts it into an empty object
		console.log(
			'Changed voice to: ',
			TTS._voices[voice],
			JSON.stringify(Object.assign({}, TTS._voices[voice]))
		)

		// Save selected voice in storage as object
		// * setData('tts_voice', TTS.getVoices()[voice])

		TTS.changeVoice(voice)
	}

	const changeSpeed = (newSpeed) => {
		setData('tts_speed', newSpeed)
	}

	const changeVolume = (newVol) => {
		setData('tts_volume', newVol)
	}

	useEffect(() => {
		;(async () => {
			await getData('tts_enabled').then((tts) => {
				setTTS(tts !== null ? tts : false)
			})
			await getData('tts_volume').then((vol) => {
				setVolume(vol !== null && typeof vol === 'number' ? vol / 100 : 1)
			})
			await getData('tts_speed').then((vel) => {
				setSpeed(vel !== null && typeof vel === 'number' ? vel / 100 : 1)
			})
		})()

		/*
		 * returned function will be called on component unmount
		 * https://stackoverflow.com/a/53465182
		 */
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
					onChange={toggleOnlyTimerTTS}
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

			<Box shadow="base">
				<Select variant="filled" onChange={(e) => changeVoice(e.target.value)}>
					{
						// Get all available voices from the OS
						// As the default value will use the first voice item in array
						// FIXME: doesn't return anything on Chrome if is the first time opening the page
						//! AFAIK this issue only happeds on windows 10.
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

			<SimpleGrid columns={2} spacing={10}>
				<Slider
					focusThumbOnChange={false} // Prevent stealing focus when using the input from bellow
					onChangeEnd={(val) => {
						const decVol = val / 100 // The real value goes from 0 to 1
						setVolume(val)
						changeVolume(decVol)
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
				<Slider
					focusThumbOnChange={false} // Prevent stealing focus when using the input from bellow
					onChangeEnd={(vel) => {
						const decVel = vel / 100 // The real value goes from 0 to 1
						setSpeed(vel)
						changeSpeed(decVel)
						TTS._rate = decVel // TTS class static var
						console.log(`Showed vol: ${vel}\nReal vol: ${decVel}`)
					}}
					defaultValue={TTS._rate * 100}
					min={1}
					max={100}
					step={1}
				>
					<SliderTrack>
						<SliderFilledTrack />
					</SliderTrack>
					<SliderThumb boxSize={6}>
						<Box color="cornflowerblue" as={RiSpeedFill} />
					</SliderThumb>
				</Slider>
			</SimpleGrid>

			<br />

			<InputGroup>
				<InputLeftElement width="4rem">
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
						size="sm"
					>
						Test
					</Button>
				</InputLeftElement>
				<Input
					pl="4rem"
					variant="outline"
					type="text"
					maxLength={140}
					onChange={handleTextChange}
					placeholder="Write anything you want the TTS to say here!"
				/>
			</InputGroup>
		</>
	)
}
