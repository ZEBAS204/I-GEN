import { useAppContext } from '../../layouts/AppContext'
import { TimeManager, MobileCountDown } from './CountDown'
import { CountDownControls } from './CountDownControl'

export default function MobileTimer() {
	const { isInMobileView } = useAppContext()

	if (isInMobileView)
		return (
			<>
				<TimeManager>
					<MobileCountDown />
				</TimeManager>
				<CountDownControls />
			</>
		)

	return <></>
}
