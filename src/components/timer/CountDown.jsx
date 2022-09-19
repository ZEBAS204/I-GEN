import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Button } from '@chakra-ui/react'
import { FaPause, FaPlay, FaWrench, FaRedoAlt } from 'react-icons/fa'

import { useTimerContext } from './TimerContext'
import TimePicker from './TimePicker'
import Clock from './Clock'

const ShapeButton = ({ icon, children, ...props }) => (
	<Button
		minW="30%"
		size="lg"
		justifyContent="flex-start"
		leftIcon={icon}
		{...props}
	>
		{children}
	</Button>
)

export default function CountDown({
	parentRunning = false,
	remainingtimeToDisplay,
}) {
	const { t } = useTranslation()
	const { toggleRunning, sendReset } = useTimerContext()
	const [isPickerVisible, setPickerVisible] = useState(false)

	const handleTogglePicker = () => setPickerVisible(!isPickerVisible)

	return (
		<>
			<Flex
				aria-label={t(`timer.${isPickerVisible ? 'picker' : 'title'}`)}
				role={isPickerVisible ? null : 'timer'}
				justifyContent="center"
				alignItems="center"
				borderRadius="20px"
				px={16}
				w="100%"
				bg="#fff"
				_dark={{
					bg: '#363e4d',
				}}
				clipPath="polygon(0 0,25% 0,calc(25% + 15px) 15px,calc(75% - 15px) 15px,75% 0,100% 0,100% 100%,60% 100%,calc(60% - 15px) calc(100% - 15px),calc(40% + 15px) calc(100% - 15px),40% 100%,0 100%)"
			>
				{isPickerVisible ? (
					<TimePicker />
				) : (
					<Clock remainingtimeToDisplay={remainingtimeToDisplay} />
				)}
			</Flex>

			<Flex
				aria-label={t('timer.controls')}
				p={10}
				gap={3}
				minW="30vw"
				bg="#fff"
				_dark={{
					bg: '#363e4d',
				}}
				justifyContent="space-between"
				borderRadius="0 0 20px 20px"
				clipPath="polygon(0 0,25% 0,calc(25% + 15px) 15px,calc(75% - 15px) 15px,75% 0,100% 0,100% 100%,60% 100%,calc(60% - 8px) calc(100% - 8px),calc(40% + 8px) calc(100% - 8px),40% 100%,0 100%)"
			>
				<ShapeButton
					icon={<FaRedoAlt />}
					onClick={isPickerVisible ? null : sendReset}
					isDisabled={isPickerVisible}
				>
					{t('buttons.reset_btn')}
				</ShapeButton>
				<ShapeButton
					icon={parentRunning ? <FaPause /> : <FaPlay />}
					onClick={isPickerVisible ? null : toggleRunning}
					isDisabled={isPickerVisible}
				>
					{parentRunning ? t('buttons.stop_btn') : t('buttons.play_btn')}
				</ShapeButton>
				<ShapeButton
					icon={<FaWrench />}
					onClick={handleTogglePicker}
					isDisabled={parentRunning}
				>
					{t('buttons.edit_btn')}
				</ShapeButton>
			</Flex>
		</>
	)
}
