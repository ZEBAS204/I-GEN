/**
 ** Current limitations of this method to allow user to change themes:
 ** ChakraUI trade-off in term of performance footprint can be easy visualized
 ** when changing themes. This performance drop is a noticeable in low-spec devices
 !! With React Developer Tools, this component will take a tiny more to load
 */

import { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { getData, setData } from '../../utils/appStorage'
import {
	Box,
	Text,
	Radio,
	RadioGroup,
	Checkbox,
	useColorMode,
	Stack,
	Heading,
} from '@chakra-ui/react'

var prevSelectedSync = null

export default function Appearance() {
	const { t } = useTranslation()

	// This functions bind to the useDispatch
	// and allows to send a signal to update other UI components

	const { colorMode, toggleColorMode } = useColorMode()
	const [systemSync, setSystemSync] = useState(prevSelectedSync ?? false)

	const toggleSystemSync = (val) => {
		setSystemSync(val)
		prevSelectedSync = val
		setData('useSystemColorMode', val)
	}

	useEffect(() => {
		;(async () => {
			prevSelectedSync === null &&
				(await getData('useSystemColorMode').then((sync) => {
					prevSelectedSync = sync
					setSystemSync(sync ? true : false)
				}))
		})()
	}, [])

	return (
		<>
			<Heading size="md">{t('settings.theme')}</Heading>
			<br />
			<Heading size="sm">Change theme</Heading>
			<Text>Blind or not blind. That's the question</Text>
			<Box padding={4}>
				<RadioGroup onChange={toggleColorMode} value={colorMode}>
					<Stack>
						<Radio value="light">Light</Radio>
						<Radio value="dark">Dark</Radio>
					</Stack>
				</RadioGroup>
				<br />
				<Checkbox
					isChecked={systemSync}
					onChange={(e) => toggleSystemSync(e.target.checked)}
				>
					Sync with system
				</Checkbox>{' '}
				(Applied on restart)
			</Box>
		</>
	)
}
