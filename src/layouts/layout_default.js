import { BrowserRouter, Route, Switch } from 'react-router-dom' // Page Handler

import { Flex } from '@chakra-ui/react'

// App Components
import SideNav from '../components/SideNavBar'

// Pages
import Home from '../pages/home'
import TimerMode from '../pages/timer'
import Settings from '../pages/settings'
import NotFoundPage from '../pages/404'

// Style
// import 'normalize.css'
import '../assets/scss/main.scss'

export default function DefaultLayout() {
	return (
		<BrowserRouter>
			<Flex id="content" className="container">
				<SideNav />

				<Flex id="content-container" className="container">
					<Switch>
						<Route exact path="/" component={Home} />
						<Route path="/settings" component={Settings} />
						<Route path="/timer" component={TimerMode} />
						<Route path="*" exact={true} component={NotFoundPage} />
					</Switch>
				</Flex>
			</Flex>
		</BrowserRouter>
	)
}
