import '@testing-library/react'

/*global vi */
Object.defineProperty(window, 'matchMedia', {
	value: vi.fn(() => ({
		matches: true,
		addListener: vi.fn(),
		removeListener: vi.fn(),
	})),
})
