import { Box } from '@chakra-ui/react'

export default function Footer() {
	return (
		<Box
			as="footer"
			color="#000"
			_dark={{
				color: '#fff',
			}}
			_after={{
				content: "'I-GEN'",
				position: 'relative',
				display: 'block',
				color: 'inherit',
				fontSize: '4em',
				height: '0',
				top: '-82px',
				textAlign: 'center',
				fontFamily: 'Poppins, Verdana, Tahoma, Georgia',
			}}
		>
			<Box
				h={20}
				display="Flex"
				clipPath="polygon(
					0 100%, 100% 100%, 100% 80%,
					calc(75% + 25px) 80%, calc(75% - 25px) 40%, calc(65% + 25px) 40%, calc(65% - 25px) 80%,
					calc(35% + 25px) 80%, calc(35% - 25px) 40%, calc(25% + 25px) 40%, calc(25% - 25px) 80%,
					0px 80%
				)"
				bgGradient="linear(90deg, #00c3ff, #6500f9, #00c3ff)"
			/>
		</Box>
	)
}
