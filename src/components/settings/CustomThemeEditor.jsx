import {
	ThemeEditor,
	ThemeEditorButton,
	ThemeEditorDrawer,
	ThemeEditorColors,
	ThemeEditorFontSizes,
} from '@hypertheme-editor/chakra-ui'
import { CgColorPicker } from 'react-icons/cg'
import { RiFontSize2 } from 'react-icons/ri'

const CustomThemeEditor = (props) => (
	<ThemeEditor>
		<ThemeEditorButton size="sm" {...props} />
		<ThemeEditorDrawer hideUpgradeToPro>
			<ThemeEditorColors icon={CgColorPicker} title="Colors" />
			<ThemeEditorFontSizes icon={RiFontSize2} title="Font Sizes" />
		</ThemeEditorDrawer>
	</ThemeEditor>
)

export default CustomThemeEditor
