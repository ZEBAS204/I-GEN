import { useTranslation } from 'react-i18next'

import { mobileViewMQ } from '../utils/constants'
import { useAppContext } from '../layouts/AppContext'

import {
	chakra,
	useColorMode,
	useColorModeValue,
	Button,
	IconButton,
	Spacer,
	useMediaQuery,
	Tag, // Used to get color scheme in buttons
} from '@chakra-ui/react'
import {
	RiTimerFlashLine,
	RiTimerFlashFill,
	RiSettings3Line,
	RiSettings3Fill,
	RiMoonClearFill,
	RiSunFill,
} from 'react-icons/ri'

// Style
import '../assets/scss/components/SideNavBar.scss'

export default function SideNav() {
	const { toggleColorMode } = useColorMode()
	const { t } = useTranslation()
	const [isInMobileView] = useMediaQuery(mobileViewMQ)

	const themeIcon = useColorModeValue(<RiSunFill />, <RiMoonClearFill />)
	const { isTimerVisible, toggleSettingVisible, toggleTimerVisible } =
		useAppContext()

	const SettingsButton = () => (
		<Tag
			variant="outline"
			className="navbar-item"
			onClick={toggleSettingVisible}
		>
			<RiSettings3Fill className="navbar-item-icon-active" />
			<RiSettings3Line className="navbar-item-icon" />
			<span className="navbar-item-label">{t('buttons.settings')}</span>
		</Tag>
	)

	const desktopNav = (
		<>
			<SettingsButton />
			<Spacer />
			<h1>LOGO</h1>
			<Spacer />
			<Tag variant="outline" className="navbar-item navbar-swap-button">
				<IconButton
					aria-label="Swap theme icon"
					onClick={toggleColorMode}
					className="navbar-item-icon"
					icon={themeIcon}
					variant="unstyled"
				/>
			</Tag>
		</>
	)

	const mobileNav = (
		<>
			<Tag
				variant="outline"
				className="navbar-item"
				onclick={toggleTimerVisible}
			>
				{isTimerVisible ? (
					<RiTimerFlashFill className="navbar-item-icon" />
				) : (
					<RiTimerFlashLine className="navbar-item-icon" />
				)}
				<span className="navbar-item-label">TIMER</span>
			</Tag>
			<Spacer />
			<Button>
				<h1>GENERATE</h1>
			</Button>
			<Spacer />
			<SettingsButton />
		</>
	)

	return (
		<chakra.nav className="nabvar" justify="center">
			{isInMobileView ? mobileNav : desktopNav}
		</chakra.nav>
	)
}
