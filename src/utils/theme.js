import { mode } from '@chakra-ui/theme-tools'
import { useTheme } from '@chakra-ui/react'

/**
 ** Overrides the default Chakra theme
 ** For example here, I used Dracula Color Palette

 ** If you want to use a custom theme
 ** see App.js comments
 */

const components = {
	Heading: {
		baseStyle: {
			fontWeight: 600,
		},
	},
}

const customTheme = {
	components,
	styles: {
		/**
		 ** Chakra gives you access to `colorMode` and `theme` in `props`
		 ** props.colorMode() is the same as mode()
		 * @see: https://chakra-ui.com/docs/features/global-styles
		 */
		global: (props) => ({
			html: {
				':root': {
					// Firefox 64 compatibility
					scrollbarColor: '#858688 rgba(0, 0, 0, 0.25)',
					scrollbarWidth: 'thin',
					// Firefox 63 compatibility
					scrollbarFaceColor: '#858688',
					scrollbarTrackColor: 'rgba(0, 0, 0, 0.25)',
				},

				'::-webkit-scrollbar': {
					width: '8px',
				},
				'::-webkit-scrollbar-track-piece': {
					border: 'none',
					backgroundColor: 'transparent',
					margin: 0,
				},
				'::-webkit-scrollbar-thumb': {
					background: 'gray',
					borderRadius: '15px',
					height: '2px',
				},
				'::-webkit-scrollbar-thumb:hover': {
					background: 'darkGray',
					maxHeight: '10px',
				},
			},

			body: {
				// Lightmode - Darkmode
				color: mode(null, '#f0f0f0')(props),
				// bg: mode(null, '#2f343f')(props),
				bgGradient: mode(
					'linear(to-t, gray.50, gray.100)',
					'linear(to-t, gray.800, gray.700)'
				)(props),

				fontFamily: 'Poppins, Arial',
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
