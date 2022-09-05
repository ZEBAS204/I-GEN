import { Grid } from '@chakra-ui/react'

import { AppContextProvider } from './AppContext'
import Settings from '@components/settings'
import Home from '@pages/home'
import About from '@components/about'
import '@assets/scss/main.scss'

export default function DefaultLayout() {
	return (
		<Grid
			as="main"
			w="100vw"
			pt={5}
			mx="1.5%"
			templateColumns="20% 50% 20%"
			templateRows="1fr"
			gap="3.5%"
			flex="1 0 auto"
		>
			<AppContextProvider>
				<Settings />
				<Home />
			</AppContextProvider>
			<About />
		</Grid>
	)
}
