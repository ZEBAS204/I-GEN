import { Text } from '@chakra-ui/react'

export default function wClock({ remainingtimeToDisplay = '00:00:00' }) {
	return (
		<Text
			fontFamily="Inter, Arial"
			bgGradient="linear(to-b, #2a71fc, #6501f9)"
			_dark={{
				bgGradient: 'linear(to-b, #5fd4ff, #634dff)',
			}}
			bgClip="text"
			fontSize="6vw"
			fontWeight={700}
		>
			{remainingtimeToDisplay}
		</Text>
	)
}
