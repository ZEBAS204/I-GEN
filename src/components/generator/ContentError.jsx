import { useState } from 'react'
import { Box, Button, Grid, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { ReactComponent as GhostIcon } from '@assets/icons/ghost.svg'

export default function ContentError({ refetch = () => {} }) {
	const { t } = useTranslation()
	const [isResetLoading, setResetLoading] = useState(false)

	return (
		<Grid
			p={8}
			mt={5}
			w="100%"
			align="center"
			whiteSpace="pre-line"
			borderRadius="20px"
			justifyItems="center"
			fontSize="2vh"
			fontWeight={700}
			fontFamily="Inter, Arial"
			bgGradient="linear(to-t, #9740ff, #e700fb)"
			clipPath="polygon(0 0,25% 0,calc(25% + 15px) 15px,calc(75% - 15px) 15px,75% 0,100% 0,100% 100%,60% 100%,calc(60% - 20px) calc(100% - 20px),calc(40% + 20px) calc(100% - 20px),40% 100%,0 100%)"
		>
			<Box as={GhostIcon} w="8em" h="8em" />
			<Text>{t('common.error_message')}</Text>
			<Button
				w="50%"
				mt={5}
				onClick={async () => {
					setResetLoading(true)
					setTimeout(() => {
						setResetLoading(false)
						refetch()
					}, 3000)
				}}
				isLoading={isResetLoading}
			>
				{t('common.refresh')}
			</Button>
		</Grid>
	)
}
