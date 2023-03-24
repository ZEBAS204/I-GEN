import { Box } from '@chakra-ui/react'

export default function Footer() {
	return (
		<Box aria-hidden>
			<Box
				h={16}
				clipPath="polygon(
					0 100%, 100% 100%, 100% 80%,
					calc(75% + 15px) 80%, calc(75% - 15px) 40%, calc(65% + 15px) 40%, calc(65% - 15px) 80%,
					calc(35% + 15px) 80%, calc(35% - 15px) 40%, calc(25% + 15px) 40%, calc(25% - 15px) 80%,
					0px 80%
				)"
				bgGradient="linear(180deg, #7b39dc, #6c39dc)"
			/>
		</Box>
	)
}
