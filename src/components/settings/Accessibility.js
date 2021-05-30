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
} from '@chakra-ui/react'

import { RiVoiceprintFill } from 'react-icons/ri'

import { useTranslation } from 'react-i18next' // Translations
import TTS from '../../utils/tts' // TTS Class

export default function Accessibility() {
	const [useTTS, setTTS] = useState(false)
	const [volume, setVolume] = useState(1)
	const [speaking, setSpeaking] = useState(false)
	const { t } = useTranslation()

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
					<Switch onChange={setTTS} isChecked={useTTS} />
				</Stack>
				<br />
				<Stack direction="row">
					<Button
						isLoading={speaking ? true : false}
						onClick={async () => {
							setSpeaking(true)
							console.log('Speaking!')
							new TTS(undefined, true).say(() => {
								setSpeaking(false)
								console.log('No more speaking :(')
							})
						}}
						colorScheme="blue"
						variant="solid"
					>
						Test
					</Button>
					<Spacer />
					<Slider
						onChangeEnd={(val) => {
							const decVol = val / 100 // The real value goes from 0 to 1
							setVolume(val)
							TTS._volume = decVol
							console.log(`Showed vol: ${val}\nReal vol: ${decVol}`)
						}}
						defaultValue="100"
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
			</Box>
		</>
	)
}
