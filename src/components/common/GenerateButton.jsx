import {useRef} from 'react'
import { Button } from '@chakra-ui/react'

import { useTranslation } from 'react-i18next'
import { useHotkeys } from 'react-hotkeys-hook'
import { useAppContext } from '../../layouts/AppContext'


export default function GenerateButton() {
	const { t } = useTranslation()
  const { generateWord } = useAppContext()

  // Bind SPACE to generator
  const genButton = useRef(null)
  useHotkeys('space', () => {
    console.log('SPACE!');
    genButton.current?.click()
  }, {
    filterPreventDefault: true,
  })

  return (
  <Button
    variant="solid"
    alignSelf="center"
    marginY={5}
    onClick={generateWord}
    children={<h1>{t('buttons.regenerate')}</h1>}
  />
  )
}