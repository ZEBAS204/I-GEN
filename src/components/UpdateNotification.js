import {
	useMediaQuery,
	Button,
	Tag,
	Icon,
	HStack,
	Flex,
	Spacer,
	Heading,
} from '@chakra-ui/react'
import { RiRefreshLine } from 'react-icons/ri'

export default function ServiceWorkerUpdate({ registration }) {
	// Update responsive
	const [isInMobileView] = useMediaQuery('(max-width: 501px)')
	const size = isInMobileView ? 'xs' : 'sm'

	const reloadPage = () => {
		registration?.postMessage({ type: 'SKIP_WAITING' })
		window.location.reload(true)
	}

	return (
		<Tag as={Flex} display="flex" variant="solid" p={2} borderRadius={0}>
			<HStack spacing={3}>
				<Icon as={RiRefreshLine} w={5} h={5} />
				<Heading size={size}>A new version is available!</Heading>
			</HStack>
			<Spacer />
			<Button variant="solid" size={size} ml={1} onClick={reloadPage}>
				Refresh
			</Button>
		</Tag>
	)
}
