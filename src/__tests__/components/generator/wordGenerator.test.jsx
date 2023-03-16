import { vi, describe, test, expect, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

import { ChakraProvider } from '@chakra-ui/react'
import { AppContextProvider } from '@src/layouts/AppContext'
import WordGenerator from '@components/generator/WordGenerator'

const MOCK_NOUN = ['NOUN_1']
const MOCK_ADJ = ['ADJ_1']

// cleanup
afterEach(() => {
	vi.fn().mockReset()
})

const renderWordGenerator = () =>
	render(
		<ChakraProvider>
			<AppContextProvider>
				<WordGenerator />
			</AppContextProvider>
		</ChakraProvider>
	)

describe('Word Generator', () => {
	test('Should render', async () => {
		global.fetch = vi.fn().mockImplementation(async (url) => {
			if (url.endsWith('noun.json'))
				return {
					json: () => MOCK_NOUN,
				}
			if (url.endsWith('adj.json'))
				return {
					json: () => MOCK_ADJ,
				}
		})

		renderWordGenerator()

		// First render
		// Component should be in "loading" state, thus not showing anything
		const adj = MOCK_ADJ[0]
		const noun = MOCK_NOUN[0]
		expect(() => screen.getByText(noun)).toThrowError()
		expect(() => screen.getByText(adj)).toThrowError()

		// Second render
		// Component should be already with words
		await waitFor(() => {
			expect(screen.getByText(noun)).toBeDefined()
			expect(screen.getByText(adj)).toBeDefined()
			expect(global.fetch).toHaveBeenCalledWith('/wordsets/en/noun.json')
			expect(global.fetch).toHaveBeenCalledWith('/wordsets/en/adj.json')
		})
	})

	test('Should render ContentError on fetch fail', async () => {
		global.fetch = vi.fn().mockImplementation(async () =>
			Promise.reject({
				message: 'dummy_error',
			})
		)

		renderWordGenerator()

		await waitFor(() => {
			expect(screen.getByText('common.error_message')).toBeDefined()
			expect(screen.getByText('common.refresh')).toBeDefined()
		})
	})
})
