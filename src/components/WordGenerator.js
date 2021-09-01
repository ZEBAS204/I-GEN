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

function WordGenerator(_props, ref) {
	const [useTTS, setTTS] = useState(false)
	const [number, setNumber] = useState(1)
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
	const genREF = useRef()
	// Get a random word from both lists (is called from outside)
	useImperativeHandle(ref, () => ({
		//* Allows to disable TTS
		disableTTS: () => {
			setTTS(false)
		},
		regenerateWord: () => {
			//! Hardcoded but do the work for debugging purposes
			if (number === 1) {
				setNumber(2)
				setWords({ noun: 'zzzzzzzzzzz', adjective: 'zzzzzzzzzzz' })
			}
			if (number === 2) {
				setNumber(3)
				setWords({ noun: 'xxxxxcfzv', adjective: 'zdvzdsbhszjnx' })
			}
			if (number === 3) {
				setNumber(4)
				setWords({
					noun: 'egad564ad56h4ad6h',
					adjective: 'gjmz4556<h4w6efaaax :3',
				})
			}
			if (number === 4) {
				setNumber(1)
				setWords({
					noun: 'asasasas',
					adjective: 'pppppppppppppppppppp',
				})
			}

			// If user enabled TTS, speak
			if (useTTS) {
				new TTS(`${words.adjective} ${words.noun}`).say()
			}
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

// Allow to take a ref
export default forwardRef(WordGenerator)
