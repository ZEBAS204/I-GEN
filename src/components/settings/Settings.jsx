// FIXME: bottom part of drawer is hide bellow the URL in mobile (edge)

import { Suspense, lazy, useState } from 'react'
import { useLifecycles, useHash, useKeyPressEvent } from 'react-use'

import { useAppContext } from '../../layouts/AppContext'

import {
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	useColorModeValue,
	Heading,
	Box,
	CloseButton,
	// Mobile
	useDisclosure,
	Drawer,
	DrawerOverlay,
	DrawerBody,
	DrawerContent,
	DrawerCloseButton,
	Flex,
} from '@chakra-ui/react'
import {
	RiLayoutLeftLine,
	RiBrushLine,
	RiToolsFill,
	RiQuestionLine,
} from 'react-icons/ri'

import { MdAccessibility, MdKeyboard } from 'react-icons/md'
import { useTranslation } from 'react-i18next'

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

export default function SettingsPage() {
	const { t } = useTranslation()
	const { isInMobileView, toggleSettingVisible } = useAppContext()
	const bgColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')
	const bgColorList = useColorModeValue('blackAlpha.300', 'whiteAlpha.300')

	const [isOpen, setOpenModal] = useState(false)
	const { onOpen, onClose } = useDisclosure({
		onOpen: () => {
			if (!isInMobileView) return
			setOpenModal(true)
		},
		onClose: () => {
			if (!isInMobileView) return
			setOpenModal(false)
		},
	})

	/** Allows to use navigation back event to close the interface */
	const [, setHash] = useHash()
	const handleBackButton = (event) => {
		event.preventDefault()
		event.stopPropagation()

		if (isOpen) {
			setHash('#settings')
			setOpenModal(false)
			return
		}

		toggleSettingVisible()
	}

	useLifecycles(
		() => {
			setHash('#settings')
			window.addEventListener('popstate', handleBackButton)
		},
		() => {
			// Remove hash and event listener on unmount
			window.removeEventListener('popstate', handleBackButton)
			setHash('')
		}
	)

	/**
	 ** Allows to close settings with ESC
	 ** When Escape is pressed, check if the target of the event is
	 ** one of the containers of settings before toggling the visibility
	 */
	useKeyPressEvent(
		'Escape',
		(event) =>
			(event.target.className?.includes('tabs') ||
				event.target === document.body) &&
			toggleSettingVisible()
	)

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
			borderRadius={isInMobileView ? '0' : 'md'}
			height="100%"
			isLazy
			lazyBehavior="unmount"
		>
			<TabList
				as={Flex}
				className="scrollable"
				flexShrink="0"
				bg={bgColorList}
				p={3}
				pr="2rem"
				gap={2}
				width={isInMobileView ? '100%' : null}
				height={isInMobileView ? '100vh' : null}
			>
				<Heading size="md">{t('buttons.settings')}</Heading>
				{settings.map((page, key) => {
					return (
						<Tab
							key={key}
							justifyContent="left"
							onClick={onOpen}
							borderRadius="lg"
							minWidth="13rem"
							fontWeight="normal"
							_selected={!isInMobileView ? null : {}}
							_hover={!isInMobileView ? { background: bgColorList } : null}
							transition={isInMobileView ? null : 'all 300ms'}
						>
							<Box as="span" mr={3}>
								{page.icon}
							</Box>
							<p>{t('settings.' + page.name, page.vars ? page.vars : null)}</p>
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
				<>
					<CloseButton
						onClick={toggleSettingVisible}
						position="absolute"
						top={5}
						right={7}
						size="lg"
					/>
					<SettingsTabContents className="scrollable" bg={bgColor} />
				</>
			)}
		</Tabs>
	)
}