import { memo, useCallback } from 'react'
import { Button, Box } from '@chakra-ui/react'
import { useKeyPressEvent } from 'react-use'

import { useTranslation } from 'react-i18next'
import { useAppContext } from '@layouts/AppContext'
import { wrapContext } from '@contexts/contextWrapper'

//* Function that avoid re-renders from the context props
const contextProps = () => {
	// Memoize callback and prevent re-renders of the button when not needed
	const { generateWord } = useCallback(useAppContext(), [])

	return {
		generateWord,
	}
}

const GenerateButton = memo(({ generateWord }) => {
	const { t } = useTranslation()

	// Bind SPACE to generator (yes, the selector is a space...)
	useKeyPressEvent(' ', (event) => {
		if (event.target === document.body) {
			event.preventDefault() // prevent scroll
			generateWord()
		}
	})

	return (
		<Box
			display="inline-flex"
			w={['45%', '20%']}
			sx={{
				// Filter trick to add focus ring to clipPath
				'--focus': 'var(--chakra-colors-blue-500)',
				'&:focus-within': {
					filter: `drop-shadow(1px 0 0 var(--focus))
          drop-shadow(-1px 0 0 var(--focus))
          drop-shadow(0 1px 0 var(--focus))
          drop-shadow(0 -1px 0 var(--focus))
          drop-shadow(1px 1px 0 var(--focus))
          drop-shadow(-1px -1px 0 var(--focus))
          drop-shadow(-1px 1px 0 var(--focus))
          drop-shadow(1px -1px 0 var(--focus))`,
				},
			}}
		>
			<Button
				aria-label={t('keybinds.words_desc')}
				aria-keyshortcuts="Space"
				onClick={generateWord}
				fontFamily="Poppins"
				fontWeight="700"
				fontSize="2xl"
				color="#f0f0f0"
				bg="#8969eb"
				w="100%"
				p={8}
				sx={{
					'&:hover, &:active, &:focus': {
						bg: '#6e4fcf',
						boxShadow: 'none',
					},
				}}
				clipPath="polygon(0 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 100% 100%, 0 100%)"
			>
				{t('buttons.regenerate')}
			</Button>
		</Box>
	)
})

export default wrapContext(GenerateButton, contextProps)
