import { AnimatePresence, motion } from 'framer-motion'
import { useAppContext } from '../../layouts/AppContext'
import SettingsPage from './Settings'

const animationVariants = {
	hidden: { y: -20, opacity: 0 },
	visible: { y: 0, opacity: 1 },
	exit: { y: -20, opacity: 0 },
}

export default function Settings() {
	const { isSettingVisible } = useAppContext()

	return (
		<AnimatePresence>
			{isSettingVisible && (
				<>
					<motion.div
						key="settings-motion"
						id="animation-container"
						variants={animationVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
					>
						<SettingsPage />
					</motion.div>
					<div id="blur-background" />
				</>
			)}
		</AnimatePresence>
	)
}
