import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { ChakraProvider } from '@chakra-ui/react'
import Clock from '@components/timer/Clock'

describe('Clock', () => {
	test('Should render', () => {
		const time = '42:06:09'
		const time2 = '59:59:59'

		const { getByText, rerender } = render(
			<ChakraProvider>
				<Clock remainingtimeToDisplay={time} />
			</ChakraProvider>
		)

		expect(getByText(time)).toBeDefined()

		rerender(
			<ChakraProvider>
				<Clock remainingtimeToDisplay={time2} />
			</ChakraProvider>
		)

		expect(screen.getByText(time2)).toBeDefined()
	})
})
