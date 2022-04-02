import { useState, useEffect, useCallback } from 'react'
import {
	useColorModeValue,
	Grid,
	Box,
	Text,
	Skeleton,
	Icon,
} from '@chakra-ui/react'
import { RiAddLine } from 'react-icons/ri'

import TTS from '../utils/tts'
import { getData } from '../utils/appStorage'
import { useAppContext } from '../layouts/AppContext'
import { ReactComponent as GhostIcon } from '../assets/icons/ghost.svg'

// Global variables: cache responses and prevent refetching when its not needed
let wasRendered = false
let fetched = false
let nouns
let adjs

async function fetchWordSets() {
	if (fetched && nouns && adjs) return

	await Promise.all([
		fetch(`${process.env.PUBLIC_URL}/static/wordsets/noun.json`)
			.then((res) => res.json())
			.then((e) => (nouns = e)),
		fetch(`${process.env.PUBLIC_URL}/static/wordsets/adj.json`)
			.then((res) => res.json())
			.then((e) => (adjs = e)),
	])
		.then((fetched = true))
		.catch((err) => console.error(err))
}

export default function WordGenerator({ disableTTS }) {
	const boxBG = useColorModeValue('blackAlpha.100', 'whiteAlpha.100')
	const [firstRender, setFirstRender] = useState(wasRendered)
	const [useTTS, setTTS] = useState(false)
	const [words, setWords] = useState({})

	const { gen } = useAppContext()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => generateNewWordSets, [gen])

	/**
	 * Create a ref so regenerateWord() can be called from outside the component
	 * See https://stackoverflow.com/a/57006730
	 */
	const generateNewWordSets = useCallback(
		(firstRun = false) => {
			if (!nouns || !adjs) return

			const noun = shuffleArray(nouns)
			const adj = shuffleArray(adjs)
			setWords({ noun, adj })

			// If user enabled TTS, speak
			if (useTTS && !firstRun) new TTS(`${adj} ${noun}`).say()
		},
		[useTTS]
	)

	useEffect(() => {
		;(async () => {
			if (disableTTS) setTTS(false)
			else
				await getData('tts_enabled').then((tts) => setTTS(tts ? true : false))

			fetchWordSets()
				.then(() => generateNewWordSets(true)) // true to prevent TTS from speaking
				.then(() => {
					setFirstRender(true)
					wasRendered = true // Prevent checking for render in future page changes
				})
		})()

		return () => {
			// On component dismount
			// Just stop TTS if speaking, already has check inside the class function
			TTS.stop()
		}
	}, [disableTTS, generateNewWordSets])

	const WordBox = ({ children }) => (
		<Box bg={boxBG} boxShadow="md" py={6} px={[4, 6]} rounded="md">
			{!firstRender ? <Skeleton h="24px" /> : <Text>{children}</Text>}
		</Box>
	)

	const ContentError = () => (
		<Grid justifyItems="center" textAlign="center">
			<Box as={GhostIcon} w="6rem" h="6rem" />
			<Text>
				Looks like the word sets have not yet loaded!
				<br />
				This could be because of a slow internet connection or something is
				blocking the data load of the sets files.
			</Text>
		</Grid>
	)

	//* Prevent showing the ContentError Message on first renders
	//* Without this, the error message will be shown before the word set
	//* have been fetched or shuffled
	if ((!nouns || !adjs) && firstRender) return <ContentError />

	return (
		<Grid
			textAlign="center"
			alignSelf="center"
			gap={3}
			width="clamp(1%, 25rem, 80%)"
			fontSize={['x-large', null, 'xx-large']}
			fontWeight={600}
		>
			<WordBox children={words.adj} />
			<Icon as={RiAddLine} w={10} h={10} m="0 auto" />
			<WordBox children={words.noun} />
		</Grid>
	)
}

/**
 * Randomize array in-place using Durstenfeld shuffle algorithm
 * @see https://stackoverflow.com/a/12646864
 */
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
	return array[0]
}
