import {
	Box,
	Text,
	Tabs,
	TabList,
	Tab as ChakraTab,
	TabPanels,
	TabPanel as CTabPanel,
} from '@chakra-ui/react'

import { useTranslation } from 'react-i18next'
import About from './About'
import Keybinds from './Keybinds'

const TabPanel = (props) => <CTabPanel tabIndex={-1} {...props} />

const Tab = (props) => (
	<ChakraTab
		p="4px"
		display="inline-block"
		bg="blackAlpha.500"
		_focusVisible={{
			bg: 'blue.600',
		}}
		_selected={{
			'&>div': {
				bg: 'whiteAlpha.400',
			},
		}}
		{...props}
	>
		<Box
			p={2}
			w="100%"
			h="100%"
			display="flex"
			alignItems="center"
			justifyContent="center"
			{...props}
		>
			{props.children}
		</Box>
	</ChakraTab>
)

// eslint-disable-next-line react/display-name
export default function () {
	const { t } = useTranslation()

	return (
		<Box
			as="section"
			px={5}
			pt={10}
			pb={14}
			bgGradient="linear-gradient(to top, #6500f9, #6F50D0 60%, transparent), linear-gradient(to right, #6F50D0, #8C6CEE)"
			borderRadius="20px"
			clipPath="polygon(0 0,25% 0,calc(25% + 15px) 15px,calc(75% - 15px) 15px,75% 0,100% 0,100% 100%,60% 100%,calc(60% - 8px) calc(100% - 8px),calc(40% + 8px) calc(100% - 8px),40% 100%,0 100%)"
		>
			<Tabs variant="unstyled" isFitted>
				<TabList>
					<Tab clipPath="polygon(100% 0, 100% 100%, 8% 100%, 0 75%, 0 0)">
						<Text fontSize="md">{t('about.title')}</Text>
					</Tab>
					<Tab clipPath="polygon(92% 0, 100% 25%, 100% 100%, 0 100%, 0 0)">
						<Text fontSize="md">{t('keybinds.title')}</Text>
					</Tab>
				</TabList>
				<TabPanels className="scrollable">
					<TabPanel>
						<About />
					</TabPanel>
					<TabPanel>
						<Keybinds />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Box>
	)
}
