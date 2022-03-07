import React, { useRef } from 'react'
import { render } from '@testing-library/react'
import WordGenerator from '../../components/WordGenerator'

jest.mock('react', () => {
	const originReact = jest.requireActual('react')

	const mUseRef = jest.fn()
	return {
		...originReact,
		useRef: mUseRef,
	}
})

const { ThemeProvider } = jest.requireActual('@chakra-ui/core')

describe('Word Generator', () => {
	it('Render without crashing', () => {
		const ref = { current: { offsetWidth: 100 } }
		useRef.mockReturnValueOnce(ref)
		render(<WordGenerator />, {
			wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
		})
	})
})
