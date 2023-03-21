import { describe, test, expect } from 'vitest'
import { render } from '@testing-library/react'

import { LoadingAnimationContainer } from '@components/common/LoadingAnimation'

describe('Loading Animation', () => {
	test('Should render', () => {
		const { getByText } = render(<LoadingAnimationContainer />)

		expect(getByText(/common\.loading/i)).toBeDefined()
	})
})
