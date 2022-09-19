import { Heading, Text, Stack, Divider, Kbd } from '@chakra-ui/react'
import { useTranslation, Trans } from 'react-i18next'

const KbdStack = ({ children }) => (
	<Text
		display="flex"
		alignItems="center"
		justifyContent="right"
		flex="1 1 auto"
		margin={0}
		pl="10px"
	>
		{children}
	</Text>
)

const Keybind = ({ children }) => (
	<Stack
		my={3}
		direction="row"
		bg="blackAlpha.200"
		borderRadius="md"
		spacing={6}
		p={3}
	>
		{children}
	</Stack>
)
const SectionDivider = () => <Divider marginY={6} />

export default function Keybinds() {
	const { t } = useTranslation()

	return (
		<>
			<Heading size="sm">{t('keybinds.desc_alert')}</Heading>
			<Text>
				<Trans
					i18nKey="keybinds.desc_keybinds"
					components={
						// eslint-disable-next-line react/jsx-key
						[<Kbd />]
					}
				/>
			</Text>

			<SectionDivider />

			<Heading size="sm">{t('keybinds.words')}</Heading>
			<Keybind>
				<Text as="samp">{t('keybinds.words_desc')}</Text>
				<KbdStack>
					<Kbd>SPACE</Kbd>
				</KbdStack>
			</Keybind>

			<SectionDivider />

			<Heading size="sm">{t('keybinds.timer')}</Heading>
			<Keybind>
				<Text as="samp">{t('keybinds.timer_desc')}</Text>
				<KbdStack>
					<Kbd>SHIFT</Kbd>
					<Kbd>S</Kbd>
				</KbdStack>
			</Keybind>
			<Keybind>
				<Text as="samp">{t('keybinds.timer_desc2')}</Text>
				<KbdStack>
					<Kbd>SHIFT</Kbd>
					<Kbd>R</Kbd>
				</KbdStack>
			</Keybind>
		</>
	)
}
