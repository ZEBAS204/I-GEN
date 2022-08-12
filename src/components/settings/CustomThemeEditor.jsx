import { useState, useCallback } from 'react'
import { ButtonGroup, Button } from '@chakra-ui/react'

import {
	ThemeEditor,
	ThemeEditorDrawer,
	ThemeEditorColors,
	useThemeEditor,
} from '@hypertheme-editor/chakra-ui'

import { CgColorPicker } from 'react-icons/cg'

const CustomThemeEditor = () => {
	/**
	 * Allows to manage the current theme
	 * @see https://www.hyperthe.me/documentation/hooks/useThemeEditor
	 */
	const [isOpen, setIsOpen] = useState(false)
	const { initialTheme, theme, setTheme, canUndo, undo, canRedo, redo } =
		useThemeEditor()

	const handleReset = () => setTheme(initialTheme)

	const handleColorChange = useCallback(() => {
		setTheme({
			...theme,
			colors: {
				blue: {
					...theme.colors.blue,
				},
			},
		})
	}, [theme])

	return (
		<>
			<Button
				onClick={() => {
					setIsOpen(!isOpen)
				}}
			>
				Open me
			</Button>
			<ThemeEditor isOpen={isOpen}>
				<ThemeEditorDrawer hideUpgradeToPro hideCredits>
					<ThemeEditorColors icon={CgColorPicker} title="Colors" />
				</ThemeEditorDrawer>
			</ThemeEditor>
			<ButtonGroup variant="outline" spacing="6">
				<Button disabled={!canUndo} onClick={undo}>
					Undo
				</Button>
				<Button disabled={!canRedo} onClick={redo}>
					Redo
				</Button>
				<Button disabled={!canUndo} onClick={handleReset}>
					Reset Theme
				</Button>
			</ButtonGroup>
		</>
	)
}

export default CustomThemeEditor
