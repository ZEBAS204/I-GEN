import {
	Box,
	Heading as CHeading,
	Select as CSelect,
	Stack as CStack,
	Spacer,
} from '@chakra-ui/react'
import PropTypes from 'prop-types'

export const Heading = ({ children, ...props }) => (
	<CHeading size="md" {...props}>
		{children}
	</CHeading>
)

export const SmallHeading = ({ children, ...props }) => (
	<CHeading as="h3" size="sm" color="whiteAlpha.800" {...props}>
		{children}
	</CHeading>
)

export const Select = ({ children, ...props }) => (
	<Box shadow="base" borderRadius="md">
		<CSelect variant="filled" {...props}>
			{children}
		</CSelect>
	</Box>
)

export const Stack = ({ heading, children, mt = 4, ...props }) => (
	<CStack direction="row" alignItems="center" mt={mt} {...props}>
		{heading && (
			<>
				<Heading size="md">{heading}</Heading>
				<Spacer />
			</>
		)}
		{children}
	</CStack>
)
Stack.propTypes = {
	heading: PropTypes.string,
	children: PropTypes.node.isRequired,
}
