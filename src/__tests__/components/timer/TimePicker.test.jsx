import {
	vi,
	describe,
	test,
	expect,
	afterAll,
	beforeEach,
	beforeAll,
} from 'vitest'
import { render, act, screen, fireEvent } from '@testing-library/react'

import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { TimePickerContent, NumSelector } from '@components/timer/TimePicker'
import { TimerContextProvider } from '@components/timer/TimerContext'

beforeAll(() => {
	Object.defineProperty(window, 'matchMedia', {
		value: vi.fn(() => ({
			matches: true,
			addListener: vi.fn(),
			removeListener: vi.fn(),
		})),
	})
})

beforeEach(() => {
	vi.restoreAllMocks()
})

// cleanup
afterAll(() => {
	vi.fn().mockReset()
})

describe('Time Picker', () => {
	test('Should render', () => {
		const { getAllByDisplayValue } = render(
			<ChakraProvider>
				<TimerContextProvider>
					<TimePickerContent />
				</TimerContextProvider>
			</ChakraProvider>
		)

		// Default time is 600 = 0 10 0
		expect(getAllByDisplayValue('0').length).toBe(2)
		expect(getAllByDisplayValue('10').length).toBe(1)
	})

	test('Should render NumSelector', () => {
		const TIME = 50
		const { getByText, getByDisplayValue } = render(
			<ChakraProvider>
				<NumSelector onSelect={() => {}} time={TIME} min={0} max={59} />
			</ChakraProvider>
		)

		// NumSelector renders the next and previous time as text
		// the selected time itself is an input
		expect(getByText(TIME + 1)).toBeDefined()
		expect(getByText(TIME - 1)).toBeDefined()
		expect(getByDisplayValue(TIME)).toBeDefined()
	})

	test('Should use onSelect callback', () => {
		const callbackSpy = vi.fn(() => {})

		let CONTAINER = document.createElement('div')
		document.body.appendChild(CONTAINER)

		const TIME = 27

		act(() => {
			createRoot(CONTAINER).render(
				<ChakraProvider>
					<NumSelector onSelect={callbackSpy} time={TIME} />
				</ChakraProvider>
			)
		})

		const button = screen.getAllByRole('button')

		// First button increases time
		fireEvent.click(button[0])
		expect(callbackSpy).toHaveBeenLastCalledWith(TIME + 1)
		expect(screen.getByDisplayValue(TIME + 1)).toBeDefined()

		// Second button decreases time
		fireEvent.click(button[1])
		expect(callbackSpy).toHaveBeenLastCalledWith(TIME)
		expect(screen.getByDisplayValue(TIME)).toBeDefined()

		// Remove container
		document.body.removeChild(CONTAINER)
		CONTAINER = undefined
	})
})
