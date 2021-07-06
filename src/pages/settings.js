import React, { Suspense } from 'react'
import {
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	useColorModeValue,
	Text,
	Box,
} from '@chakra-ui/react'

import {
	RiLayoutLeftLine,
	RiBrushLine,
	RiToolsFill,
	RiQuestionLine,
} from 'react-icons/ri'

import { MdAccessibility, MdKeyboard } from 'react-icons/md'
import { useTranslation } from 'react-i18next' // Translations

// Settings Pages
const Interface = React.lazy(() => import('../components/settings/Interface'))
const Appearance = React.lazy(() => import('../components/settings/Appearance'))
const Accessibility = React.lazy(() =>
	import('../components/settings/Accessibility')
)
const Keybinds = React.lazy(() => import('../components/settings/Keybinds'))
const Advanced = React.lazy(() => import('../components/settings/Advanced'))
const About = React.lazy(() => import('../components/settings/About'))

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
			icon: <RiLayoutLeftLine />,
		},
		{
			name: 'appearance',
			content: Appearance,
			icon: <RiBrushLine />,
		},
		{
			name: 'accessibility',
			content: Accessibility,
			icon: <MdAccessibility />,
		},
		{
			name: 'advanced',
			content: Advanced,
			icon: <RiToolsFill />,
		},
		{
			name: 'keybinds',
			content: Keybinds,
			icon: <MdKeyboard />,
		},
		{
			name: 'about',
			content: About,
			icon: <RiQuestionLine />,
			vars: {
				app_name: 'var',
			},
		},
	]

	return (
		<Tabs
			orientation="vertical"
			variant="solid-rounded"
			flexBasis="100%" // Allow to fill empty space
			isLazy
			lazyBehavior
		>
			<TabList bg={bgColor} borderRadius="md" p={3}>
				<Text fontSize="xl">{t('buttons.settings')}</Text>
				{settings.map((page, key) => {
					return (
						<Tab key={key} justifyContent="left">
							<Box as="span" mr={2}>
								{page.icon}
							</Box>
							{t('settings.' + page.name, page.vars ? page.vars : null)}
						</Tab>
					)
				})}
			</TabList>

			<TabPanels bg={bgColor} borderRadius="md" ml={5} p={3}>
				{settings.map((page, key) => {
					return (
						<TabPanel key={key}>
							<Suspense fallback="">
								{
									/* Creates a new dinamic element
									 * https://stackoverflow.com/questions/29875869/react-jsx-dynamic-component-name
									 */
									React.createElement(page.content)
								}
							</Suspense>
						</TabPanel>
					)
				})}
			</TabPanels>
		</Tabs>
	)
}

export default Settings
