import React from 'react'
import { Link } from 'react-router-dom' // Page Handler
import { Stack, Text, Button, Center } from '@chakra-ui/react'

// Ghost background
import '../assets/scss/components/404.scss'

const NotFoundPage = () => (
	<Center
		p={3}
		borderRadius="md"
		flexBasis="100%" // Allow to fill empty space
	>
		<Stack justify="center" style={{ textAlign: 'center' }}>
			<Text fontSize="6xl">OOPS...</Text>
			<Text fontSize="lg">You just hit a route that doesn't exist... :(</Text>
			<Link to="/">
				<Button size="lg" m={8}>
					TAKE ME BACK HOME!
				</Button>
			</Link>
		</Stack>
		<div className="ghost_background" />
	</Center>
)

export default NotFoundPage
