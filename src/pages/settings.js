import { Suspense, lazy } from 'react'
import {
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	useColorModeValue,
	Text,
	Box,
	// Mobile
	useDisclosure,
	useMediaQuery,
	Drawer,
	DrawerOverlay,
	DrawerBody,
	DrawerContent,
	DrawerCloseButton,
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
const Interface = lazy(() => import('../components/settings/Interface'))
const Appearance = lazy(() => import('../components/settings/Appearance'))
const Accessibility = lazy(() => import('../components/settings/Accessibility'))
const Keybinds = lazy(() => import('../components/settings/Keybinds'))
const Advanced = lazy(() => import('../components/settings/Advanced'))
const About = lazy(() => import('../components/settings/About'))

export default function Settings() {
	const { t } = useTranslation()

	// Use for mobile view
	// TODO: use global constant variables for Media Query
	const [isInMobileView] = useMediaQuery('(max-width: 650px)')
	const { isOpen, onOpen, onClose } = useDisclosure()

	const bgColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')

	/*
	 All settings pages with their names
	 * name = their name in settings (eg. setting.interface)
	 * content = imported page (can be required() + .default )
	 * vars = if name needs a variable to be passed for translation, here will go
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
			name: 'keybinds',
			content: Keybinds,
			icon: <MdKeyboard />,
		},
		{
			name: 'advanced',
			content: Advanced,
			icon: <RiToolsFill />,
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

	const SettingsTabContents = (props) => (
		<TabPanels {...props}>
			{settings.map((page, key) => (
				<TabPanel key={key}>
					<Suspense fallback={<></>}>
						<page.content />
					</Suspense>
				</TabPanel>
			))}
		</TabPanels>
	)

	return (
		<Tabs
			className="scrollable"
			orientation="vertical"
			variant="solid-rounded"
			flexBasis="100%" // Allow to fill empty space
			isLazy
			lazyBehavior
		>
			<TabList
				className="scrollable"
				flexShrink="0"
				bg={bgColor}
				p={3}
				borderRadius={isInMobileView ? '0' : 'md'}
				width={isInMobileView ? '100%' : 'auto'}
			>
				<Text fontSize="xl" mb={2}>
					{t('buttons.settings')}
				</Text>
				{settings.map((page, key) => {
					return (
						<Tab
							key={key}
							justifyContent="left"
							onClick={onOpen}
							_selected={
								isInMobileView ? { color: 'inherit', bg: 'none' } : null
							}
						>
							<Box as="span" mr={2}>
								{page.icon}
							</Box>
							{t('settings.' + page.name, page.vars ? page.vars : null)}
						</Tab>
					)
				})}
			</TabList>
			{isInMobileView ? (
				<Drawer isOpen={isOpen} onClose={onClose} size="full" placement="right">
					<DrawerOverlay />
					<DrawerContent>
						<DrawerCloseButton />
						<DrawerBody>
							<SettingsTabContents />
						</DrawerBody>
					</DrawerContent>
				</Drawer>
			) : (
				<SettingsTabContents
					className="scrollable"
					bg={bgColor}
					borderRadius="md"
					ml={5}
					p={3}
				/>
			)}
		</Tabs>
	)
}
