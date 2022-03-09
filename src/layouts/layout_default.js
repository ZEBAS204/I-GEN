import { HashRouter, Route, Routes } from 'react-router-dom'
import { Flex } from '@chakra-ui/react'

// App Components
import { AppContextProvider } from './AppContext'
import SideNav from '../components/SideNavBar'
import Settings from '../components/settings'

// Pages
import Home from '../pages/home'
import NotFoundPage from '../pages/404'

// Style
import '../assets/scss/main.scss'

export default function DefaultLayout() {
	return (
		<HashRouter>
			<AppContextProvider>
				<Settings />
				<Flex id="content" direction="column" className="container">
					<SideNav />

					<Flex id="content-container" className="container">
						<Routes>
							<Route exact path="/" element={<Home />} />
							<Route exact path="*" element={<NotFoundPage />} />
						</Routes>
					</Flex>
				</Flex>
			</AppContextProvider>
		</HashRouter>
	)
}
