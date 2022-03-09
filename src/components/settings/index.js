// FIXME: bottom part of drawer is hide bellow the URL in mobile (edge)

import { Suspense, lazy, useState } from 'react'
import { useAppContext } from '../../layouts/AppContext'

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
import { useTranslation } from 'react-i18next'
import { useBlocker } from '../../utils/useBlocker'

// Settings Pages
const Interface = lazy(() => import('./Interface'))
const Appearance = lazy(() => import('./Appearance'))
const Accessibility = lazy(() => import('./Accessibility'))
const Keybinds = lazy(() => import('./Keybinds'))
const Advanced = lazy(() => import('./Advanced'))
const About = lazy(() => import('./About'))

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

export default function Settings() {
	const { t } = useTranslation()
	const { isSettingVisible } = useAppContext()

	// Use for mobile view
	// TODO: use global constant variables for Media Query
	const [isInMobileView] = useMediaQuery('(max-width: 650px)')
	const [isBackBTNBlock, blockBackBTN] = useState(false)
	const [isOpen, setOpenModal] = useState(false)
	const { onOpen, onClose } = useDisclosure({
		onOpen: () => {
			setOpenModal(true)
			blockBackBTN(true)
		},
		onClose: () => {
			setOpenModal(false)
			blockBackBTN(false)
		},
	})

	const bgColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')

	/**
	 ** Only in mobile view, back button will be disabled if the
	 ** drawer is active to prevent user from changing page
	 */
	useBlocker(() => {
		setOpenModal(false)
		blockBackBTN(false)
		return ''
	}, isInMobileView && isBackBTNBlock)

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

	if (!isSettingVisible) return <></>

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
					<DrawerContent py={3}>
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
