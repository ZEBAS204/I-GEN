import React from 'react'
import {
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	useColorModeValue,
	Text,
} from '@chakra-ui/react'

import { useTranslation } from 'react-i18next' // Translations
import Interface from '../components/settings/Interface'
import Appearance from '../components/settings/Appearance'
import Accessibility from '../components/settings/Accessibility'
import Advanced from '../components/settings/Advanced'
import About from '../components/settings/About'

function Settings() {
	const bgColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')
	const { t } = useTranslation()

	return (
		<Tabs
			orientation="vertical"
			variant="unstyled"
			isLazy
			lazyBehavior
			flexBasis="100%" // Allow to fill empty space
		>
			<TabList bg={bgColor} borderRadius="md" p={3}>
				<Text fontSize="xl">{t('buttons.settings')}</Text>

				<Tab>{t('settings.interface')}</Tab>
				<Tab>{t('settings.appearance')}</Tab>
				<Tab>{t('settings.accessibility')}</Tab>
				<Tab>{t('settings.keybinds')}</Tab>
				<Tab>{t('settings.advanced')}</Tab>
				<Tab>{t('settings.about', { app_name: 'AN' })}</Tab>
			</TabList>

			<TabPanels bg={bgColor} borderRadius="md" ml={5} p={3}>
				<TabPanel>
					<Interface />
				</TabPanel>
				<TabPanel>
					<Appearance />
				</TabPanel>
				<TabPanel>
					<Accessibility />
				</TabPanel>
				<TabPanel>
					<Advanced />
				</TabPanel>
				<TabPanel>
					<Advanced />
				</TabPanel>
				<TabPanel>
					<About />
				</TabPanel>
			</TabPanels>
		</Tabs>
	)
}

export default Settings
