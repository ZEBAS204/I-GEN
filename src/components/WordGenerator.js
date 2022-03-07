// FIXME: will always return `unsaponified || ??? + September` on first load

import {
	useState,
	useEffect,
	useImperativeHandle,
	forwardRef,
	useCallback,
} from 'react'
import { useColorModeValue, Grid, Box, Text, Skeleton } from '@chakra-ui/react'
import { ReactComponent as GhostIcon } from '../assets/icons/ghost.svg'
import TTS from '../utils/tts'
import { getData } from '../utils/appStorage'

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

function WordGenerator(_props, ref) {
	const boxBG = useColorModeValue('blackAlpha.100', 'whiteAlpha.100')
	const [firstRender, setFirstRender] = useState(wasRendered)
	const [useTTS, setTTS] = useState(false)
	const [words, setWords] = useState({})

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

	// Expose functions
	useImperativeHandle(ref, () => ({
		regenerateWord: () => generateNewWordSets(),
	}))

	useEffect(() => {
		;(async () => {
			if (_props.disableTTS) setTTS(false)
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
	}, [_props.disableTTS, generateNewWordSets])

	const WordBox = ({ children }) => (
		<Box bg={boxBG} boxShadow="md" p={[3, 6]} rounded="md">
			{!firstRender ? <Skeleton w="90px" h="24px" /> : <Text>{children}</Text>}
		</Box>
	)

	const ContentError = () => (
		<Grid justifyItems="center" textAlign="center">
			<Box as={GhostIcon} w="6rem" h="6rem" />
			<Text>Looks like the word sets have not yet loaded!</Text>
			<Text>
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
			templateColumns="1fr auto 1fr "
			alignItems="center"
			textAlign="center"
			gap={3}
		>
			<WordBox children={words.adj} />
			<Text fontSize="20px">+</Text>
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
		return array[j]
	}
}

// Allow to take a ref
export default forwardRef(WordGenerator)
