import { describe, test, expect, vi, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'

import useFetch from '@components/generator/UseFetch'

const MOCK_DATA = ['WORD_1']

afterEach(() => {
	vi.fn().mockReset()
})

describe('useFetch hook', () => {
	test('Fetch request resolves using URL', async () => {
		const FETCH_URL = '192.168.1.1/dummy'
		global.fetch = vi.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve(MOCK_DATA),
			})
		)

		const { result } = renderHook(() => useFetch(FETCH_URL))

		expect(result.current.isLoading).toBe(true)

		await waitFor(() => {
			expect(result.current.data).toBe(MOCK_DATA)
		})

		expect(global.fetch).toHaveBeenCalledWith(FETCH_URL, {})
	})

	test('Fetch request resolves using function', async () => {
		const callbackSpy = vi.fn(() => Promise.resolve(MOCK_DATA))

		const { result } = renderHook(() => useFetch(callbackSpy))

		expect(result.current.isLoading).toBe(true)

		await waitFor(() => {
			expect(result.current.data).toBe(MOCK_DATA)
		})

		expect(callbackSpy).toHaveBeenCalled()
	})
})
