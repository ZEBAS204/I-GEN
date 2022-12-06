import { Text, Link as CLink } from '@chakra-ui/react'
import { Trans } from 'react-i18next'

/* eslint-disable react/jsx-key, no-undef */
// i18next already handles the missing key prop
// __PROJECT_SOURCE__ is wrongly marked as undefined
const Link = ({ children, ...props }) => (
	<u>
		<CLink {...props}>{children}</CLink>
	</u>
)

export default function about() {
	return (
		<>
			<Text>
				<Trans
					i18nKey="about.desc"
					components={[<Link href={__PROJECT_SOURCE__} isExternal />, <br />]}
				/>
			</Text>
			<br />
			<Text>
				<Trans
					i18nKey="about.desc_acknowledge"
					components={[
						<Link href="https://kaikki.org/" isExternal />,
						<Link href={__PROJECT_SOURCE__} isExternal />,
					]}
				/>
			</Text>
		</>
	)
}
