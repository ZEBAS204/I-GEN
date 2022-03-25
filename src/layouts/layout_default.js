import { Flex } from '@chakra-ui/react'

// App Components
import { AppContextProvider } from './AppContext'
import SideNav from '../components/SideNavBar'
import Settings from '../components/settings'
import MobileTimer from '../components/timer/MobileTimer'

// Pages
import Home from '../pages/home'

// Style
import '../assets/scss/main.scss'

export default function DefaultLayout() {
	return (
		<AppContextProvider>
			<Settings />
			<Flex id="content" direction="column" className="container">
				<SideNav />
				<MobileTimer />

				<Flex id="content-container" className="container">
					<Home />
				</Flex>
			</Flex>
		</AppContextProvider>
	)
}
