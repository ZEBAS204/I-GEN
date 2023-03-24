/*
 * Generated using cssload.net
 */
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Box, Text } from '@chakra-ui/react'
import '@styles/components/LoadingAnimation.scss'

export const LoadingAnimation = (props) => (
	<Box className="cssload-coffee" {...props} />
)

export const LoadingAnimationContainer = (props) => {
	const { t } = useTranslation()
	const { showLabel, ...animationProps } = props

	return (
		<Box
			w="100%"
			h="100%"
			display="flex"
			flexDir="column"
			alignItems="center"
			justifyContent="center"
			aria-busy="true"
		>
			<LoadingAnimation {...animationProps} aria-hidden />
			{showLabel && (
				<Text position="relative" top="1em">
					{t('common.loading')}...
				</Text>
			)}
		</Box>
	)
}

LoadingAnimationContainer.propTypes = {
	showLabel: PropTypes.bool,
}

LoadingAnimationContainer.defaultProps = {
	showLabel: true,
}
