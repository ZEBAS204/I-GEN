import { mode } from '@chakra-ui/theme-tools'

/**
 ** Overrides the default Chakra theme
 ** For example here, I used Nord Color Palette

 ** If you want to use a custom theme
 ** see index.js comments
 */
const customTheme = {
	/**
	 ** Only css root variables are changed
	 ** By default palette ranges are from 50 to 900 in intervals of 100
	 ** colors.whiteAlpha.100 --> --chakra-colors-gray-100;
	 * @see https://chakra-ui.com/docs/features/css-variables
	 */
	colors: {
		white: '#fff',
		black: '#000',
		// Use in dark mode
		whiteAlpha: {
			50: '#242933',
			100: '#2B303B',
			200: '#404859',
			300: '#555F77',
			400: '#6B7794',
			500: '#8590A8',
			600: '#A0A8BB',
			700: '#BBC1CE',
			800: '#D5D9E1',
			900: '#F0F1F4',
		},
		// Use in dark light mode
		blackAlpha: {
			50: '#fff',
			100: '#eff1f6',
			200: '#fff',
			300: '#d8dee9',
			400: '#cbd3e1',
			500: '#BEC8DA',
			600: '#B1BDD2',
			700: '#A4B2CB',
			800: '#97A8C3',
			900: '#8A9DBC',
		},
	},
	styles: {
		/**
		 ** Chakra gives you access to `colorMode` and `theme` in `props`
		 ** props.colorMode() is the same as mode()
		 * @see: https://chakra-ui.com/docs/features/global-styles
		 */
		global: (props) => ({
			body: {
				// fontFamily: 'body',
				bg: mode('#f2f4f8', '#242933')(props),
			},
		}),
	},
}

export { customTheme }
