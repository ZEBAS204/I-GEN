import { vi, describe, test, expect, afterEach } from 'vitest'
import { render, act, screen, fireEvent } from '@testing-library/react'

import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import CountDown from '@components/timer/CountDown'
import { TimerContext } from '@components/timer/TimerContext'

afterEach(() => {
	vi.fn().mockReset()
})

describe('Countdown', () => {
	const context_values = {
		time: 600,
		changeTime: () => {},
		speak: false,
		toggleSpeak: () => {},
		isRunning: false,
		toggleRunning: () => {},
		reset: false,
		sendReset: () => {},
	}

	test('Should render', () => {
		render(
			<ChakraProvider>
				<TimerContext.Provider value={context_values}>
					<CountDown />
				</TimerContext.Provider>
			</ChakraProvider>
		)

		const resetButton = screen.getByText('buttons.reset_btn')
		const playButton = screen.getByText('buttons.play_btn')
		const editButton = screen.getByText('buttons.edit_btn')

		expect(resetButton).toBeDefined()
		expect(playButton).toBeDefined()
		expect(editButton).toBeDefined()

		//Time should be 00:00:00
		expect(screen.getByText('00:00:00')).toBeDefined()
	})

	test('Edit button should be disabled when running', () => {
		render(
			<ChakraProvider>
				<TimerContext.Provider value={context_values}>
					<CountDown parentRunning={true} />
				</TimerContext.Provider>
			</ChakraProvider>
		)

		const editButton = screen.getByText('buttons.edit_btn')
		expect(editButton).toHaveProperty('disabled')
	})

	test('Should call context methods', async () => {
		let CONTAINER = document.createElement('div')
		document.body.appendChild(CONTAINER)

		const toggleRunning = vi.spyOn(context_values, 'toggleRunning')
		const sendReset = vi.spyOn(context_values, 'sendReset')

		act(() => {
			createRoot(CONTAINER).render(
				<ChakraProvider>
					<TimerContext.Provider value={context_values}>
						<CountDown />
					</TimerContext.Provider>
				</ChakraProvider>
			)
		})

		const resetButton = screen.getByText('buttons.reset_btn')
		fireEvent.click(resetButton)
		expect(sendReset).toHaveBeenCalled()

		const playButton = screen.getByText('buttons.play_btn')
		fireEvent.click(playButton)
		expect(toggleRunning).toHaveBeenCalled()

		// Clicking the edit button hides the timer
		const editButton = screen.getByText('buttons.edit_btn')
		fireEvent.click(editButton)

		//Time should be 00:00:00, but it's hidden by the time editor
		expect(() => screen.getByText('00:00:00')).toThrowError()

		// Remove container
		document.body.removeChild(CONTAINER)
		CONTAINER = undefined
	})
})
