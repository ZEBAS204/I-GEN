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
				<Text fontSize="xl">{t('settings')}</Text>

				<Tab>{t('interface')}</Tab>
				<Tab>{t('appearance')}</Tab>
				<Tab>{t('accessibility')}</Tab>
				<Tab>{t('keybinds')}</Tab>
				<Tab>{t('advanced')}</Tab>
				<Tab>{t('about', { app_name: 'AN' })}</Tab>
			</TabList>

			<TabPanels bg={bgColor} borderRadius="md" ml={5} p={3}>
				<TabPanel>
					<Interface />
				</TabPanel>
				<TabPanel>
					<Advanced />
				</TabPanel>
				<TabPanel>
					<About />
				</TabPanel>
				<div>
					<div header="APP Settings"></div>
					<div header="Keybinds">............</div>
					<div header="Appearance">
						<h2>Ripple Effect</h2>
						<h2>Theme</h2>
						<div className="p-grid">
							<p className="p-ml-2">Alternate between themes </p>
						</div>
					</div>
				</div>
			</TabPanels>
		</Tabs>
	)
}

export default Settings
