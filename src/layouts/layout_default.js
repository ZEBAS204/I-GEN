import { HashRouter, Route, Routes } from 'react-router-dom'

import { Flex } from '@chakra-ui/react'

// App Components
import SideNav from '../components/SideNavBar'

// Pages
import Home from '../pages/home'
import TimerMode from '../pages/timer'
import Settings from '../pages/settings'
import NotFoundPage from '../pages/404'

// Style
import '../assets/scss/main.scss'

export default function DefaultLayout() {
	return (
		<HashRouter>
			<Flex id="content" className="container">
				<SideNav />

				<Flex id="content-container" className="container">
					<Routes>
						<Route exact path="/" element={<Home />} />
						<Route path="/settings" element={<Settings />} />
						<Route path="/timer" element={<TimerMode />} />
						<Route exact path="*" element={<NotFoundPage />} />
					</Routes>
				</Flex>
			</Flex>
		</HashRouter>
	)
}
