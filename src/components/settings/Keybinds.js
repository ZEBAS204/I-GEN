import {
	useColorModeValue,
	Heading,
	Text,
	Stack,
	Divider,
	Kbd,
} from '@chakra-ui/react'

import { useTranslation } from 'react-i18next' // Translations

export default function Keybinds() {
	const { t } = useTranslation()
	const lineBG = useColorModeValue('blackAlpha.100', 'whiteAlpha.100')

	const BindsButtons = ({ children }) => <Text w="90px" align="center">{children}</Text>

	const BindLine = ({ children }) => (
		<Stack
			m={3}
			direction="row"
			bg={lineBG}
			borderRadius="md"
			spacing={6}
			p={3}
		>
			{children}
		</Stack>
	)
	const SectionDivider = () => <Divider marginY={6} />

	return (
		<>
			<Heading size="md">{t('settings.keybinds')}</Heading>
			<br />
			<Heading size="sm">Remember!</Heading>
			<Text>
				You can always use <Kbd>TAB</Kbd> and <Kbd>SHIFT</Kbd> + <Kbd>TAB</Kbd>{' '}
				to move around the hole page!
			</Text>
			<SectionDivider />

			<Heading size="sm">Navigation</Heading>
			<BindLine>
				<BindsButtons>
					<Kbd>SHIFT</Kbd> + <Kbd>1</Kbd>
				</BindsButtons>
				<Text as="samp">Main page</Text>
			</BindLine>
			<BindLine>
				<BindsButtons>
					<Kbd>SHIFT</Kbd> + <Kbd>2</Kbd>
				</BindsButtons>
				<Text as="samp">Timer mode</Text>
			</BindLine>
			<BindLine>
				<BindsButtons>
					<Kbd>SHIFT</Kbd> + <Kbd>3</Kbd>
				</BindsButtons>
				<Text as="samp">Settings</Text>
			</BindLine>

			<SectionDivider />

			<Heading size="sm">Appearance</Heading>
			<BindLine>
				<BindsButtons>
					<Kbd>SHIFT</Kbd> + <Kbd>C</Kbd>
				</BindsButtons>
				<Text as="samp">Toggle light/dark color mode</Text>
			</BindLine>

			<SectionDivider />

			<Heading size="sm">Home page</Heading>
			<BindLine>
				<BindsButtons>
					<Kbd>SPACE</Kbd>
				</BindsButtons>
				<Text as="samp">Generate new pair of words</Text>
			</BindLine>

			<SectionDivider />

			<Heading size="sm">Timer mode</Heading>
			<BindLine>
				<BindsButtons>
					<Kbd>SPACE</Kbd>
				</BindsButtons>
				<Text as="samp">Pause/Unpause timer</Text>
			</BindLine>

			<SectionDivider />

			<Heading size="sm">Settings</Heading>
			<BindLine>
				<BindsButtons>
					<Kbd>↓</Kbd> <Kbd>↑</Kbd>
				</BindsButtons>
				<Text as="samp">Navigate through different pages</Text>
			</BindLine>
		</>
	)
}
