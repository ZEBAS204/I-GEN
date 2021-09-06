import React, {
	useState,
	useEffect,
	useRef,
	useImperativeHandle,
	forwardRef,
} from 'react'
import { Box, Flex, Spacer, Icon, Text, Stack } from '@chakra-ui/react'
import { IoAdd } from 'react-icons/io5' // + Icon

import TTS from '../utils/tts' // TTS
import { getData } from '../utils/appStorage'

// Cache random element to improve performance
const rnd = Math.random
var nouns
var adjs

if (process.env.NODE_ENV === 'development') {
	nouns = require('../static/wordsets/noun.json')
	adjs = require('../static/wordsets/adj.json')
} else {
	fetch('./wordsets/noun.json')
		.then((response) => response.json())
		.then((data) => {
			nouns = data
		})
	fetch('./wordsets/adj.json')
		.then((response) => response.json())
		.then((data) => {
			adjs = data
		})
}

function WordGenerator(_props, ref) {
	const [useTTS, setTTS] = useState(false)
	const [words, setWords] = useState({
		noun: 'postcard',
		adjective: 'thinking',
	})

	useEffect(() => {
		;(async () => {
			await getData('tts_enabled').then((tts) => {
				setTTS(tts !== null ? tts : false)
			})
		})()

		return () => {
			// On component dismount
			// Just stop TTS if speaking, already has check inside the class function
			TTS.stop()
		}
	}, [])

	/**
	 * Create a ref so "regenerateWord" can be called from outside
	 * See https://stackoverflow.com/a/57006730
	 */
	//
	const generateNewWordSets = async () => {
		const noun = shuffleArray(nouns)
		const adj = shuffleArray(adjs)

		setWords({
			noun,
			adjective: adj,
		})

		// If user enabled TTS, speak
		if (useTTS) {
			new TTS(`${adj} ${noun}`).say()
		}
	}

	const genREF = useRef()
	// Get a random word from both lists (is called from outside)
	useImperativeHandle(ref, () => ({
		//* Allows to disable TTS
		disableTTS: () => {
			setTTS(false)
		},
		regenerateWord: () => {
			generateNewWordSets()
		},
	}))

	return (
		<Stack ref={genREF}>
			<Flex align="center">
				<Box boxShadow="md" p="6" rounded="md">
					<Text>{words.adjective}</Text>
				</Box>
				<Spacer />
				<Box rounded="md">
					<Icon as={IoAdd} fontSize="20px" />
				</Box>
				<Spacer />
				<Box boxShadow="md" p="6" maxW="3xl" rounded="md">
					<Text>{words.noun}</Text>
				</Box>
			</Flex>
		</Stack>
	)
}

/**
 * Randomize array in-place using Durstenfeld shuffle algorithm
 * @see https://stackoverflow.com/a/12646864
 */
function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		const j = Math.floor(rnd() * (i + 1))
		var temp = array[i]
		array[i] = array[j]
		array[j] = temp
	}
	return temp
}

// Allow to take a ref
export default forwardRef(WordGenerator)
