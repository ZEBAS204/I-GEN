import { mode } from '@chakra-ui/theme-tools'

/**
 ** Overrides the default Chakra theme
 ** For example here, I used Dracula Color Palette

 ** If you want to use a custom theme
 ** see App.js comments
 */

const breakpoints = {
	sm: '560px',
	md: '768px',
	lg: '960px',
	xl: '1200px',
	'2xl': '1536px',
}

const components = {
	Heading: {
		baseStyle: {
			fontWeight: 600,
			fontFamily: 'Poppins, Arial',
		},
	},
	Input: {
		variants: {
			filled: {
				field: {
					boxShadow: 'base',
					bg: 'blackAlpha.400',
					_hover: {
						bg: 'blackAlpha.500',
					},
					_focus: {
						bg: 'blackAlpha.200',
					},
				},
			},
		},
	},
	Select: {
		variants: {
			filled: {
				field: {
					color: '#fff',
					bg: 'blackAlpha.400',
					_hover: {
						bg: 'blackAlpha.500',
					},
				},
			},
		},
	},
	Kbd: {
		baseStyle: {
			color: '#000',
			_dark: {
				color: '#f0f0f0',
			},
		},
	},
}

const customTheme = {
	breakpoints,
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

				'::-webkit-scrollbar, .scrollablebar::-webkit-scrollbar': {
					width: '8px',
				},
				'::-webkit-scrollbar-track-piece, .scrollablebar::-webkit-scrollbar-track-piece':
					{
						border: 'none',
						backgroundColor: 'transparent',
						margin: 0,
					},
				'::-webkit-scrollbar-thumb, .scrollablebar::-webkit-scrollbar-thumb': {
					background: 'gray',
					borderRadius: '15px',
					height: '2px',
				},
				'::-webkit-scrollbar-thumb:hover, .scrollablebar::-webkit-scrollbar-thumb:hover':
					{
						background: 'darkGray',
						maxHeight: '10px',
					},
			},

			body: {
				// Lightmode - Darkmode
				color: '#f0f0f0',
				bg: mode('#e6e1f8', '#1c1b22')(props),

				fontFamily: 'Poppins, Arial',
			},
		}),
	},
}

export { customTheme }
