import { memo, useCallback } from 'react'
import { Button } from '@chakra-ui/react'
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
		<Button
			aria-label={t('keybinds.words_desc')}
			aria-keyshortcuts="Space"
			onClick={generateWord}
			fontFamily="Poppins"
			fontWeight="700"
			fontSize="2xl"
			w={['4%', '20%']}
			p={8}
			colorScheme="purple"
			bg="#8969eb"
			sx={{
				'&:hover, &:active, &:focus-visible': {
					bg: '#6e4fcf',
				},
			}}
			color="#f0f0f0"
			clipPath="polygon(0 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 100% 100%, 0 100%)"
		>
			{t('buttons.regenerate')}
		</Button>
	)
})

export default wrapContext(GenerateButton, contextProps)
