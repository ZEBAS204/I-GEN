import { Button } from '@chakra-ui/react'
import { useKeyPressEvent } from 'react-use'

import { useTranslation } from 'react-i18next'
import { useAppContext } from '../../layouts/AppContext'

export default function GenerateButton() {
	const { t } = useTranslation()
	const { generateWord } = useAppContext()

	// Bind SPACE to generator (yes, the selector is a space...)
	useKeyPressEvent(
		' ',
		(event) => event.target === document.body && generateWord()
	)

	return (
		<Button
			variant="solid"
			alignSelf="center"
			onClick={generateWord}
			children={<h1>{t('buttons.regenerate')}</h1>}
		/>
	)
}
