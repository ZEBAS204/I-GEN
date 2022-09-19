import { useState, useEffect } from 'react'
import { useLatest } from 'react-use'
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

	// Bind keys to toggle timer and reset it
	const isPickerSelected = useLatest(isPickerVisible)
	useEffect(() => {
		const callback = ({ shiftKey, code: key, target }) => {
			if (isPickerSelected.current) return
			if (!shiftKey) return
			else if (!(key === 'KeyR' || key === 'KeyS')) return
			else if (target.nodeName === 'INPUT') return

			if (key === 'KeyR') sendReset()
			if (key === 'KeyS') toggleRunning()
		}
		document.addEventListener('keydown', callback)
		return () => {
			document.removeEventListener('keydown', callback)
		}
	}, [])

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
				as="section"
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
					aria-keyshortcuts="Shift+R"
				>
					{t('buttons.reset_btn')}
				</ShapeButton>
				<ShapeButton
					icon={parentRunning ? <FaPause /> : <FaPlay />}
					onClick={isPickerVisible ? null : toggleRunning}
					isDisabled={isPickerVisible}
					aria-keyshortcuts="Shift+S"
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
