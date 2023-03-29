import { useState } from 'react'
import { useLifecycles, useUpdateEffect } from 'react-use'
import { Grid, Box, Text, Skeleton, Icon } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { RiAddLine } from 'react-icons/ri'

import { useAppContext } from '@layouts/AppContext'
import TTS from '@utils/tts'
import ContentError from './ContentError'
import useFetch from './UseFetch'

const WordBox = ({ word, isLoading, ...props }) => (
	<Box
		aria-live="polite"
		aria-relevant="text"
		bg="#fff"
		_dark={{
			bg: 'linear-gradient(to right, #6b4ecb 1%, #363e4d 1%, #363e4d 99%, #6b4ecb 99%)',
		}}
		p={[4, 8]}
		rounded="20px"
		_after={
			import.meta.env.DEV && {
				content: 'attr(aria-label)',
				position: 'relative',
				display: 'block',
				transform: 'translate(-50%)',
				inset: '-50% 0 0 15%',
				color: '#00ff00',
				h: 0,
			}
		}
		{...props}
	>
		{isLoading ? (
			<Skeleton w="50%" minH="1.5em" margin="0 auto" borderRadius={5} />
		) : (
			<Text>{word}</Text>
		)}
	</Box>
)

export default function WordGenerator() {
	const { t } = useTranslation()
	const [words, setWords] = useState({})
	const { gen, isTTSEnabled, isWordDisplayFlip, nounLang, adjLang } =
		useAppContext()

	const { data, isLoading, isError, refetch } = useFetch(() =>
		Promise.all([
			fetch(`/wordsets/${nounLang}/noun.json`)
				.then((res) => res.json())
				.then((e) => shuffleArray(e)),
			fetch(`/wordsets/${adjLang}/adj.json`)
				.then((res) => res.json())
				.then((e) => shuffleArray(e)),
		])
	)

	const nouns = data ? data[0] : []
	const adjs = data ? data[1] : []

	const getNewPairOfWords = () => ({
		noun: nouns[Math.floor(Math.random() * nouns.length)],
		adj: adjs[Math.floor(Math.random() * adjs.length)],
	})

	const speakWords = ({ noun, adj }) => {
		if (!isTTSEnabled) return
		if (isWordDisplayFlip) [noun, adj] = [adj, noun]
		new TTS(`${adj} ${noun}`).say()
	}

	const generateNewWordSets = (firstRun = false) => {
		if (!nouns || !adjs) return

		const { noun, adj } = getNewPairOfWords()
		setWords({ noun, adj })

		if (firstRun) return
		speakWords({ noun, adj })
	}

	// On component dismount
	// Just stop TTS if speaking, already has check inside the method
	useLifecycles(null, () => TTS.stop())

	// We specify the context props that will trigger updates
	useUpdateEffect(() => {
		generateNewWordSets(true)
	}, [data])
	useUpdateEffect(() => {
		generateNewWordSets()
	}, [gen])
	useUpdateEffect(() => {
		refetch()
	}, [nounLang, adjLang])

	//* Prevent showing the ContentError Message on first renders
	//* Without this, the error message will be shown before the word set
	//* have been fetched or shuffled
	if (isError) return <ContentError refetch={refetch} />

	return (
		<Grid
			w="100%"
			fontSize={['xx-large', 'xxx-large']}
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
				word={isWordDisplayFlip ? words.noun : words.adj}
				aria-label={t(`common.${isWordDisplayFlip ? 'noun' : 'adjective'}`)}
				clipPath="polygon(0 0,25% 0,calc(25% + 15px) 15px,calc(75% - 15px) 15px,75% 0,100% 0,100% 100%,60% 100%,calc(60% - 20px) calc(100% - 20px),calc(40% + 20px) calc(100% - 20px),40% 100%,0 100%)"
				{...isLoading}
			/>
			<Box h={0} aria-hidden>
				<Icon
					as={RiAddLine}
					color="#8a6aec"
					position="relative"
					display="block"
					top={['-48px', '-73px']}
					w="3em"
					h="3em"
					m="0 auto"
					zIndex={1}
				/>
			</Box>
			<WordBox
				word={isWordDisplayFlip ? words.adj : words.noun}
				aria-label={t(`common.${isWordDisplayFlip ? 'adjective' : 'noun'}`)}
				clipPath={[
					`polygon(0 0, 40% 0, calc(40% + 20px) 20px, calc(60% - 20px) 20px, 60% 0, 100% 0, 100% 100%,
					75% 100%, calc(75% - 15px) calc(100% - 20px), calc(25% + 15px) calc(100% - 20px), 25% 100%,
					0 100%)`,
					`polygon(0 0,
					40% 0px, calc(40% + 20px) 20px, calc(60% - 20px) 20px, 60% 0px,
					100% 0,100% 100%,60% 100%,calc(60% - 20px) calc(100% - 20px),calc(40% + 20px) calc(100% - 20px),40% 100%,
				0 100%)`,
				]}
				{...isLoading}
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
