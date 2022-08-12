import Sheet from 'react-modal-sheet'

import { useAppContext } from '../../layouts/AppContext'
import TimePicker from './TimePicker'

import '../../assets/scss/components/CountDownControl.scss'

const CountDownControls = () => {
	const { isTimePickerVisible, toggleTimePickerVisible } = useAppContext()

	return (
		<Sheet isOpen={isTimePickerVisible} onClose={toggleTimePickerVisible}>
			<Sheet.Container>
				<Sheet.Header />
				<Sheet.Content>
					<hr />
					<br />
					<TimePicker />
				</Sheet.Content>
			</Sheet.Container>

			<Sheet.Backdrop onClick={toggleTimePickerVisible} />
		</Sheet>
	)
}

export { CountDownControls }
