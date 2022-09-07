import { Suspense, lazy } from 'react'
import { Box, DarkMode } from '@chakra-ui/react'
import { LoadingAnimationContainer } from '../common/LoadingAnimation'
import { useTranslation } from 'react-i18next'

// Settings Pages
const Interface = lazy(() => import('./Interface'))
const Appearance = lazy(() => import('./Appearance'))
const Accessibility = lazy(() => import('./Accessibility'))

/*
	 All settings pages with their names
	 * name = their name in settings (eg. setting.interface)
	 * content = imported page (can be required() + .default )
	 * vars = if name needs a variable to be passed for translation, here will go
	 */
const settings = [
	{
		name: 'appearance',
		content: Appearance,
		dark: false,
	},
	{
		name: 'interface',
		content: Interface,
		dark: true,
	},
	{
		name: 'accessibility',
		content: Accessibility,
		dark: true,
	},
]

export default function SettingsPage() {
	const { t } = useTranslation()

	const SettingsColumns = () =>
		settings.map((page, index) => (
			<Box
				key={index}
				role="listitem"
				filter={index ? 'drop-shadow(0 0px 3px rgba(0, 0, 0, .5))' : null}
			>
				<Box
					px={5}
					pt={10}
					pb={16}
					mb={-8}
					bgGradient="linear-gradient(to top, transparent, #6F50D0)"
					borderRadius="20px"
					clipPath={
						!index
							? null
							: 'polygon(-1px 15px, 0px 15px, 15px 0px, 15px 0px, 15px 0px, 15px 0px, 15px -1px, calc(50% - 22.5px) -1px, calc(50% - 22.5px) 0px, calc(50% - 7.5px) 15px, calc(50% + 7.5px) 15px, calc(50% + 22.5px) 0px, calc(50% + 22.5px) -1px, calc(100% - 15px) -1px, calc(100% - 15px) 0px, 100% 15px, 100% 15px, 100% 15px, 100% 15px, calc(100% + 1px) 15px, 100% 100%, 0 100%)'
					}
				>
					{page.dark ? (
						<DarkMode>
							<page.content />
						</DarkMode>
					) : (
						<page.content />
					)}
				</Box>
			</Box>
		))

	return (
		<Box
			as="section"
			aria-label={t('settings.title')}
			role="list"
			bgGradient="linear-gradient(to top, #1C2F68, #6F50D0)"
			borderRadius="20px"
			clipPath="polygon(0 0,25% 0,calc(25% + 15px) 15px,calc(75% - 15px) 15px,75% 0,100% 0,100% 100%,60% 100%,calc(60% - 8px) calc(100% - 8px),calc(40% + 8px) calc(100% - 8px),40% 100%,0 100%)"
		>
			<Suspense fallback={<LoadingAnimationContainer />}>
				<SettingsColumns />
			</Suspense>
		</Box>
	)
}
