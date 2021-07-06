import React, { useState, useEffect } from 'react'
import { getData, setData, clearData } from '../../utils/appStorage'
import Logger from '../../utils/logger'
import {
	Text,
	Divider,
	Switch,
	Stack,
	Spacer,
	Heading,
	Button,
} from '@chakra-ui/react'

import { useTranslation } from 'react-i18next' // Translations

export default function Keybinds() {
	const { t } = useTranslation()

	useEffect(() => {}, [])

	return (
		<>
			<Heading size="md">{t('settings.keybinds')}</Heading>
			<br />
		</>
	)
}
