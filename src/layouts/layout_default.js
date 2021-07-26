import { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom' // Page Handler

import { Flex } from '@chakra-ui/react' // chakra-ui Framework

// App Components
import SideNav from '../components/SideNavBar' // Import Side Navigation Bar
//! import DownloadToastMessage from '../components/DownloadToast' // Download Message

// Pages
import Home from '../pages/home'
import TimerMode from '../pages/timer'
import Settings from '../pages/settings'
import NotFoundPage from '../pages/404' // 404

// Style
import 'normalize.css'
import '../assets/scss/main.scss'

class DefaultLayout extends Component {
	// If isn't running on Electron nor User interacted before.
	// Load Toast with Download Message
	componentDidMount() {
		//! DownloadToastMessage()
	}

	render() {
		return (
			<BrowserRouter>
				<Flex id="content" h="100%" className="container">
					<SideNav />

					<Flex
						id="content-container"
						className="container"
						grow={1}
						basis={'auto'}
						my={5}
						mr={5}
						ml={0}
					>
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
}

export default DefaultLayout
