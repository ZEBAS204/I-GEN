import '@testing-library/react'

/*global vi */
Object.defineProperty(window, 'matchMedia', {
	value: vi.fn(() => ({
		matches: true,
		addListener: vi.fn(),
		removeListener: vi.fn(),
	})),
})

window.ResizeObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}))
