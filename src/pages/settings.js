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
	const { t } = useTranslation()
	const bgColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')

	/*
	 All settings pages with their names
	 * name = their name in settings (eg. setting.interface)
	 * content = imported page (can be required() + .default )
	 * vars = if name needs a vars to be passed for translation, here will be
	 */
	const settings = [
		{
			name: 'interface',
			content: Interface,
		},
		{
			name: 'appearance',
			content: Appearance,
		},
		{
			name: 'accessibility',
			content: Accessibility,
		},
		{
			name: 'advanced',
			content: Advanced,
		},
		{
			name: 'about',
			vars: {
				app_name: 'AAS',
			},
			content: About,
		},
	]

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
				{settings.map((page, key) => {
					return (
						<Tab key={key}>
							{t('settings.' + page.name, page.vars ? page.vars : null)}
						</Tab>
					)
				})}
			</TabList>

			<TabPanels bg={bgColor} borderRadius="md" ml={5} p={3}>
				{settings.map((page, key) => {
					return (
						<TabPanel key={key}>
							{
								/* Creates a new dinamic element
								 * https://stackoverflow.com/questions/29875869/react-jsx-dynamic-component-name
								 */
								React.createElement(page.content)
							}
						</TabPanel>
					)
				})}
			</TabPanels>
		</Tabs>
	)
}

export default Settings
