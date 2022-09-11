import { useState, useCallback } from 'react'
import { useLifecycles, useUpdateEffect } from 'react-use'
import { Grid, Box, Text, Skeleton, Icon, Button } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { RiAddLine } from 'react-icons/ri'

import TTS from '@utils/tts'
import { useAppContext } from '@layouts/AppContext'
import { ReactComponent as GhostIcon } from '@assets/icons/ghost.svg'

// Global variables: cache responses and prevent refetching when is unneeded
let wasRendered = false
let fetched = []
let nouns = null
let adjs = null

async function fetchWordSets(nounLang, adjLang) {
	if (!nounLang || !adjLang) return
	if (nouns && adjs && fetched.toString() == [nounLang, adjLang].toString())
		return

	await Promise.all([
		fetch(`/wordsets/${nounLang}/noun.json`)
			.then((res) => res.json())
			.then((e) => (nouns = shuffleArray(e))),
		fetch(`/wordsets/${adjLang}/adj.json`)
			.then((res) => res.json())
			.then((e) => (adjs = shuffleArray(e))),
	])
		.then((fetched = [nounLang, adjLang]))
		.catch((err) => {
			console.error('Error fetching wordsets\n', err)
			nouns = null
			adjs = null
		})
}

export default function WordGenerator() {
	const { t } = useTranslation()
	const {
		gen,
		isTTSEnabled,
		isWordDisplayFlip: isWordFlip,
		nounLang,
		adjLang,
	} = useAppContext()

	const [firstRender, setFirstRender] = useState(wasRendered)
	const [isResetLoading, setResetLoading] = useState(false)

	const [words, setWords] = useState({})

	useUpdateEffect(() => generateNewWordSets(), [gen])
	useUpdateEffect(() => {
		fetchNewWordSets()
	}, [nounLang, adjLang])

	const fetchNewWordSets = async () => {
		fetchWordSets(nounLang, adjLang).then(() => generateNewWordSets(true)) // prevent TTS from speaking
	}

	const getNewPairOfWords = () => ({
		noun: nouns[Math.floor(Math.random() * nouns.length)],
		adj: adjs[Math.floor(Math.random() * adjs.length)],
	})

	const speakWords = ({ noun, adj }) =>
		isTTSEnabled && new TTS(`${adj} ${noun}`).say()

	const generateNewWordSets = useCallback(
		(firstRun = false) => {
			if (!nouns || !adjs) return

			const { noun, adj } = getNewPairOfWords()
			setWords({ noun, adj })

			if (firstRun) return
			speakWords({ noun, adj })
		},
		[isTTSEnabled]
	)

	useLifecycles(
		// On component mount, we need to fetch the current word sets
		// and generate a new pair of words
		() => {
			fetchNewWordSets().finally(() => {
				setFirstRender(true)
				wasRendered = true // Prevent checking for render in future component renders
			})
		},

		// On component dismount
		// Just stop TTS if speaking, already has check inside the class function
		() => TTS.stop()
	)

	const WordBox = ({ word, ...props }) => (
		<Box
			bg="#fff"
			_dark={{
				bg: 'linear-gradient(to right, #6b4ecb 1%, #363e4d 1%, #363e4d 99%, #6b4ecb 99%)',
				boxShadow: 'none',
			}}
			boxShadow="inset 0 0 3px #000"
			rounded="20px"
			p={8}
			{...props}
		>
			{!firstRender ? (
				<Skeleton w="50%" minH="1em" margin="0 auto" />
			) : (
				<Text>{word}</Text>
			)}
		</Box>
	)

	const ContentError = () => (
		<Grid
			p={8}
			mt={5}
			align="center"
			borderRadius="20px"
			justifyItems="center"
			fontSize="2vh"
			fontWeight={700}
			fontFamily="Inter, Arial"
			bgGradient="linear(to-t, #ff4040, #fbca00)"
			clipPath="polygon(0 0,25% 0,calc(25% + 15px) 15px,calc(75% - 15px) 15px,75% 0,100% 0,100% 100%,60% 100%,calc(60% - 20px) calc(100% - 20px),calc(40% + 20px) calc(100% - 20px),40% 100%,0 100%)"
		>
			<Box as={GhostIcon} w="8em" h="8em" />
			<Text>
				Looks like the word sets have not yet loaded!
				<br />
				This could be because of a slow internet connection or something is
				blocking the data load of the sets files.
			</Text>
			<Button
				w="50%"
				mt={5}
				colorScheme="teal"
				onClick={async () => {
					setResetLoading(true)
					setTimeout(() => setResetLoading(false), 3000)
					fetchWordSets(nounLang, adjLang).then(() => generateNewWordSets(true))
				}}
				isLoading={isResetLoading}
			>
				{t('common.refresh')}
			</Button>
		</Grid>
	)

	//* Prevent showing the ContentError Message on first renders
	//* Without this, the error message will be shown before the word set
	//* have been fetched or shuffled
	if (firstRender && (!nouns || !adjs)) return <ContentError />

	return (
		<Grid
			w="100%"
			fontSize="xxx-large"
			textAlign="center"
			fontFamily="Inter, Arial"
			textTransform="capitalize"
			fontWeight={700}
			lineHeight="80px"
			color="#000"
			_dark={{
				color: '#fff',
			}}
			gap={2}
			pt={5}
		>
			<WordBox
				word={isWordFlip ? words.noun : words.adj}
				aria-label={t(`common.${isWordFlip ? 'noun' : 'adjective'}`)}
				clipPath="polygon(0 0,25% 0,calc(25% + 15px) 15px,calc(75% - 15px) 15px,75% 0,100% 0,100% 100%,60% 100%,calc(60% - 20px) calc(100% - 20px),calc(40% + 20px) calc(100% - 20px),40% 100%,0 100%)"
			/>
			<Box h={0} aria-hidden="true">
				<Icon
					as={RiAddLine}
					color="#8a6aec"
					position="relative"
					display="block"
					top="-73px"
					w="3em"
					h="3em"
					m="0 auto"
					zIndex={1}
				/>
			</Box>
			<WordBox
				word={isWordFlip ? words.adj : words.noun}
				aria-label={t(`common.${isWordFlip ? 'adjective' : 'noun'}`)}
				clipPath="polygon(0 0,
					40% 0px, calc(40% + 20px) 20px, calc(60% - 20px) 20px, 60% 0px,
					100% 0,100% 100%,60% 100%,calc(60% - 20px) calc(100% - 20px),calc(40% + 20px) calc(100% - 20px),40% 100%,
				0 100%)"
			/>
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
