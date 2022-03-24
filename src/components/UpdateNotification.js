import {
	Button,
	Flex,
	Spacer,
	Alert,
	AlertIcon,
	AlertTitle,
} from '@chakra-ui/react'
import { FiRefreshCcw } from 'react-icons/fi'

export default function ServiceWorkerUpdate({ registration }) {
	const reloadPage = () => {
		registration?.postMessage({ type: 'SKIP_WAITING' })
		window.location.reload(true)
	}

	return (
		<Alert as={Flex} status="info">
			<AlertIcon as={FiRefreshCcw} />
			<AlertTitle>A new version is available!</AlertTitle>
			<Spacer />
			<Button variant="solid" size="sm" ml={1} onClick={reloadPage}>
				Refresh
			</Button>
		</Alert>
	)
}
