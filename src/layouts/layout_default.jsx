import { Grid, Flex } from '@chakra-ui/react'
import { useMedia } from 'react-use'

import { AppContextProvider } from './AppContext'
import Settings from '@components/settings'
import Home from '@pages/home'
import About from '@components/about'
import '@assets/scss/main.scss'

const Display = ({ children, ...props }) => {
	const isSmallDisplay = useMedia('(max-width: 800px)')

	return isSmallDisplay ? (
		<Flex
			flex="1"
			overflow="auto hidden"
			scrollSnapType="x mandatory"
			className="scrollablebar"
			{...props}
			sx={{
				'& > section': {
					width: '100vw',
					scrollSnapAlign: 'start',
					scrollSnapStop: 'always',
					flexShrink: 0,
					overflowY: 'auto',
				},
			}}
		>
			{children}
		</Flex>
	) : (
		<Grid
			mx="1.5%"
			gap="3.5%"
			flex="1 0 auto"
			templateColumns="20% 50% 20%"
			templateRows="1fr"
			{...props}
		>
			{children}
		</Grid>
	)
}

export default function DefaultLayout() {
	return (
		<Display as="main" w="100vw" pt={4} mb={-8}>
			<AppContextProvider>
				<Settings />
				<Home />
			</AppContextProvider>
			<About />
		</Display>
	)
}
