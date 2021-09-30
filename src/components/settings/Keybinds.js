import React from 'react'
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

	const BindLine = (props) => (
		<Stack
			m={3}
			direction="row"
			bg={lineBG}
			borderRadius="md"
			spacing={6}
			p={3}
		>
			{props.children}
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
				<Text as="samp">Main page</Text>
				<span>
					<Kbd>SHIFT</Kbd> + <Kbd>1</Kbd>
				</span>
			</BindLine>
			<BindLine>
				<Text as="samp">Timer mode</Text>
				<span>
					<Kbd>SHIFT</Kbd> + <Kbd>2</Kbd>
				</span>
			</BindLine>
			<BindLine>
				<Text as="samp">Settings</Text>
				<span>
					<Kbd>SHIFT</Kbd> + <Kbd>3</Kbd>
				</span>
			</BindLine>

			<SectionDivider />

			<Heading size="sm">Appearance</Heading>
			<BindLine>
				<Text as="samp">Toggle light/dark color mode</Text>
				<span>
					<Kbd>SHIFT</Kbd> + <Kbd>C</Kbd>
				</span>
			</BindLine>

			<SectionDivider />

			<Heading size="sm">Home page</Heading>
			<BindLine>
				<Text as="samp">Generate new pair of words</Text>
				<span>
					<Kbd>SPACE</Kbd>
				</span>
			</BindLine>

			<SectionDivider />

			<Heading size="sm">Timer mode</Heading>
			<BindLine>
				<Text as="samp">Pause/Unpause timer</Text>
				<span>
					<Kbd>SPACE</Kbd>
				</span>
			</BindLine>

			<SectionDivider />

			<Heading size="sm">Settings</Heading>
			<BindLine>
				<Text as="samp">Navigate through different pages</Text>
				<span>
					<Kbd>↓</Kbd> <Kbd>↑</Kbd>
				</span>
			</BindLine>
		</>
	)
}
