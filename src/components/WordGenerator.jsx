import { useState, useCallback } from 'react'
import { useLifecycles, useUpdateEffect } from 'react-use'
import {
	useColorModeValue,
	Grid,
	Box,
	Text,
	Skeleton,
	Icon,
	Button,
} from '@chakra-ui/react'
import { RiAddLine } from 'react-icons/ri'

import TTS from '../utils/tts'
import { useAppContext } from '../layouts/AppContext'
import { useLocalForage } from '../utils/appStorage'
import { ReactComponent as GhostIcon } from '../assets/icons/ghost.svg'

// Global variables: cache responses and prevent refetching when is unneeded
let wasRendered = false
let fetched = false
let nouns = null
let adjs = null

async function fetchWordSets(nounLang = 'en', adjLang = 'en') {
	if (fetched && nouns && adjs) return

	await Promise.all([
		fetch(`/wordsets/${nounLang}/noun.json`)
			.then((res) => res.json())
			.then((e) => (nouns = shuffleArray(e))),
		fetch(`/wordsets/${adjLang}/adj.json`)
			.then((res) => res.json())
			.then((e) => (adjs = shuffleArray(e))),
	])
		.then((fetched = true))
		.catch((err) => console.error(err))
}

export default function WordGenerator() {
	const { gen, speak } = useAppContext()
	const boxBG = useColorModeValue('blackAlpha.100', 'whiteAlpha.100')

	const [firstRender, setFirstRender] = useState(wasRendered)
	const [useTTS] = useLocalForage('tts_only_timermode', false)
	const [words, setWords] = useState({})

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useUpdateEffect(() => generateNewWordSets(), [gen])

	const getNewPairOfWords = () => ({
		noun: nouns[Math.floor(Math.random() * nouns.length)],
		adj: adjs[Math.floor(Math.random() * adjs.length)],
	})

	const generateNewWordSets = useCallback(
		(firstRun = false) => {
			if (!nouns || !adjs) return

			const { noun, adj } = getNewPairOfWords()
			setWords({ noun, adj })

			// If user enabled TTS, speak
			if (useTTS && !firstRun) new TTS(`${adj} ${noun}`).say()
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[speak]
	)

	useLifecycles(
		// On component mount, we need to fetch the current word sets
		// and generate a new pair of words
		async () => {
			fetchWordSets()
				.then(() => generateNewWordSets(true)) // prevent TTS from speaking
				.then(() => {
					setFirstRender(true)
					wasRendered = true // Prevent checking for render in future component renders
				})
		},
		// On component dismount
		// Just stop TTS if speaking, already has check inside the class function
		() => TTS.stop()
	)

	const WordBox = ({ children }) => (
		<Box
			bg={boxBG}
			boxShadow="md"
			py={6}
			px={[4, 6]}
			rounded="md"
			sx={{
				// Fade effect
				position: 'relative',
				'&:after, &:before': {
					content: '""',
					position: 'absolute',
					width: '100%',
					height: '100%',
					top: 0,
					left: 0,
					backgroundColor: boxBG,
					opacity: 0.5,
					borderRadius: 'inherit',
					transformOrigin: 'center',
					pointerEvents: 'none',
					zIndex: -1,
				},
				'&:before': {
					transform: 'scale3d(1.05,1.2,1)',
				},
				'&:after': {
					transform: 'scale3d(1.1,1.4,1)',
				},
			}}
		>
			{!firstRender ? <Skeleton h="24px" /> : <Text>{children}</Text>}
		</Box>
	)

	const ContentError = () => (
		<Grid
			justifyItems="center"
			textAlign="center"
			alignContent="center"
			gap={10}
			width="clamp(1%, 25rem, 80%)"
		>
			<Box as={GhostIcon} w="6rem" h="6rem" />
			<Text>
				Looks like the word sets have not yet loaded!
				<br />
				This could be because of a slow internet connection or something is
				blocking the data load of the sets files.
			</Text>
			<Button
				onClick={() => fetchWordSets().then(() => generateNewWordSets(true))}
			>
				Refresh
			</Button>
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
			gap={[6, 8]}
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
	return array
}
