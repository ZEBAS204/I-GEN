import { useMediaQuery, Grid, Flex } from '@chakra-ui/react'

import { AppContextProvider } from './AppContext'
import Settings from '@components/settings'
import Home from '@pages/home'
import About from '@components/about'
import '@assets/scss/main.scss'

const Display = ({ children, ...props }) => {
	const [isSmallDisplay] = useMediaQuery('(max-width: 800px)')

	return isSmallDisplay ? (
		<Flex
			flex="1"
			overflow="auto hidden"
			scrollSnapType="x mandatory"
			{...props}
			sx={{
				'& > section': {
					width: '100vw',
					scrollSnapAlign: 'start',
					flexShrink: 0,
					overflowY: 'auto',
				},
			}}
		>
			{children}
		</Flex>
	) : (
		<Grid
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
		<Display as="main" w="100vw" pt={5} mx="1.5%" mb={-8} gap="3.5%">
			<AppContextProvider>
				<Settings />
				<Home />
			</AppContextProvider>
			<About />
		</Display>
	)
}
