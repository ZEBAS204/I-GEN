import React from 'react'
import { shallow, mount } from 'enzyme'
import Settings from '../../pages/Settings'

const settings_pages = 6

describe('Settings Page', () => {
	it('Render without crashing', () => {
		shallow(<Settings />)
	})

	it('Contains all pages', () => {
		const wrapper = mount(<Settings />)
		console.log(wrapper.debug())
		expect(wrapper.find('button')).toHaveLength(settings_pages)
	})
})
