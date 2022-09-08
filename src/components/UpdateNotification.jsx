import {
	Button,
	Flex,
	Spacer,
	Alert,
	AlertIcon,
	AlertTitle,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FaDownload } from 'react-icons/fa'

const ServiceWorkerUpdate = ({ isUpdateAvailable, registration }) => {
	const { t } = useTranslation()

	const reloadPage = () => {
		registration?.postMessage({ type: 'SKIP_WAITING' })
		window.location.reload(true)
	}

	return (
		<Alert
			as={Flex}
			role="alert"
			status="info"
			h={16}
			pb={6}
			mb={-4}
			bgGradient="linear(0deg, #7b39dc, #6c39dc)"
			clipPath="polygon(
					0 0%, 100% 0%, 100% 80%,
					calc(75% + 15px) 80%, calc(75% - 15px) 40%, calc(65% + 15px) 40%, calc(65% - 15px) 80%,
					calc(35% + 15px) 80%, calc(35% - 15px) 40%, calc(25% + 15px) 40%, calc(25% - 15px) 80%,
					0px 80%)"
		>
			{isUpdateAvailable && (
				<>
					<AlertIcon as={FaDownload} color="#fff" />
					<AlertTitle>{t('common.new_version')}</AlertTitle>
					<Spacer />
					<Button variant="solid" size="sm" ml={1} onClick={reloadPage}>
						{t('common.refresh')}
					</Button>
				</>
			)}
		</Alert>
	)
}

export default ServiceWorkerUpdate
