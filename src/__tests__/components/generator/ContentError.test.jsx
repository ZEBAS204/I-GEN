import {
	vi,
	describe,
	test,
	expect,
	afterAll,
	beforeAll,
	beforeEach,
} from 'vitest'
import { render, act, screen, fireEvent } from '@testing-library/react'

import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import ContentError from '@components/generator/ContentError'

beforeAll(() => {
	vi.useFakeTimers()
})

beforeEach(() => {
	vi.clearAllTimers()
	vi.setSystemTime(0)
})

// cleanup
afterAll(() => {
	vi.useRealTimers()
	vi.fn().mockReset()
})

describe('Content Error', () => {
	test('Should render', () => {
		const { getByText } = render(
			<ChakraProvider>
				<ContentError />
			</ChakraProvider>
		)
		// screen.debug()
		expect(getByText('common.error_message')).toBeDefined()
		expect(getByText('common.refresh')).toBeDefined()
	})

	test('Should use refresh callback', async () => {
		const callbackSpy = vi.fn(() => 1)

		let CONTAINER = document.createElement('div')
		document.body.appendChild(CONTAINER)

		act(() => {
			createRoot(CONTAINER).render(
				<ChakraProvider>
					<ContentError refetch={callbackSpy} />
				</ChakraProvider>
			)
		})

		const button = screen.getByRole('button')
		fireEvent.click(button)

		// Skip 3 second delay before the
		// component use the passed callback
		// (wrapped in act to handle component updates)
		act(() => {
			vi.advanceTimersToNextTimer()
		})
		expect(callbackSpy).toHaveBeenCalled()

		// Remove container
		document.body.removeChild(CONTAINER)
		CONTAINER = undefined
	}, 6000)
})
