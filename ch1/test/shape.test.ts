import { expect } from 'chai'
import { area, circ, circle, rect } from '../src/shapes';

describe('', () => {
	it('has area', () => {
		expect( area( rect(2, 2 ))).to.eql(4)
	})

	it('has circle', () => {
		expect( circ( circle(2 ))).to.closeTo(12.56, 0.01)
	})
});