import { useAppContext } from '../../layouts/AppContext'
import { MobileCountDown } from './CountDown'
import { CountDownControlsMobile } from './CountDownControl'

export default function MobileTimer() {
	const { isInMobileView } = useAppContext()

	if (isInMobileView)
		return (
			<>
				<MobileCountDown />
				<CountDownControlsMobile />
			</>
		)

	return <></>
}
