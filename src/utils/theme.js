import { mode, getColor } from '@chakra-ui/theme-tools'
import { useTheme } from '@chakra-ui/react'

/**
 ** Overrides the default Chakra theme
 ** For example here, I used Dracula Color Palette

 ** If you want to use a custom theme
 ** see App.js comments
 */
const customTheme = {
	/**
	 ** Only css root variables are changed
	 ** By default palette ranges are from 50 to 900 in intervals of 100
	 ** colors.whiteAlpha.100 --> --chakra-colors-gray-100;
	 * @see https://chakra-ui.com/docs/features/css-variables
	 */
	/*
	colors: {
		white: '#fff',
		black: '#000',

		cyan: {
			50: '#fafeff',
			100: '#d4f8ff',
			200: '#aff0fe',
			300: '#8be9fd',
			400: '#67e1fb',
			500: '#44d9f8',
			600: '#22d0f5',
			700: '#0dbfe5',
			800: '#0ca0bf',
			900: '#0c819a',
		},
		green: {
			50: '#e2ffe9',
			100: '#bcffcd',
			200: '#97feb1',
			300: '#73fc96',
			400: '#50fa7b',
			500: '#2df760',
			600: '#0cf346',
			700: '#0ccd3d',
			800: '#0ba833',
			900: '#0a8329',
		},
		orange: {
			50: '#ffefdd',
			100: '#ffdcb7',
			200: '#ffca92',
			300: '#ffb86c',
			400: '#fda648',
			500: '#fb9325',
			600: '#f38107',
			700: '#cd6d08',
			800: '#a75a08',
			900: '#824707',
		},
		pink: {
			50: '#ffeaf6',
			100: '#ffc4e6',
			200: '#ff9fd6',
			300: '#ff79c6',
			400: '#fd55b6',
			500: '#fb31a5',
			600: '#f80e95',
			700: '#d90880',
			800: '#b3086b',
			900: '#8e0855',
		},
		purple: {
			50: '#fefeff',
			100: '#e9dafe',
			200: '#d3b6fc',
			300: '#bd93f9',
			400: '#a771f6',
			500: '#924ff2',
			600: '#7d2eed',
			700: '#6916e0',
			800: '#5914bb',
			900: '#491298',
		},
		red: {
			50: '#ffecec',
			100: '#ffc6c6',
			200: '#ffa0a0',
			300: '#ff7b7b',
			400: '#ff5555',
			500: '#fd3131',
			600: '#fb0e0e',
			700: '#dd0606',
			800: '#b70707',
			900: '#910707',
		},
		yellow: {
			50: '#fefff8',
			100: '#fafed3',
			200: '#f6fcaf',
			300: '#f1fa8c',
			400: '#ebf769',
			500: '#e5f347',
			600: '#dfef26',
			700: '#ccdd12',
			800: '#abb811',
			900: '#899410',
		},
	},
	*/

	styles: {
		/**
		 ** Chakra gives you access to `colorMode` and `theme` in `props`
		 ** props.colorMode() is the same as mode()
		 * @see: https://chakra-ui.com/docs/features/global-styles
		 */
		global: (props) => ({
			body: {
				// Lightmode - Darkmode
				color: mode(null, '#f0f0f0')(props),
				// bg: mode(null, '#2f343f')(props),
				bgGradient: mode(
					'linear(to-t, gray.50, gray.100)',
					'linear(to-t, gray.800, gray.700)'
				)(props),
			},
		}),
	},
}

/** Exposes the current color scheme */
function useColorScheme() {
	const currentColor = useTheme().components.Button.defaultProps.colorScheme

	return currentColor
}

export { customTheme, useColorScheme }
