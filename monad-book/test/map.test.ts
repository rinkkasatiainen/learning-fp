import { expect } from 'chai';
import { concat, map, singleton } from '../src/lists';

describe('lists', () => {

	it('can \'map\' on a list', () => {
		const orig = [1, 2]
		const stringify: (x: number) => string = number => `${ number }`

		expect(map(stringify)(orig)).to.eql(['1', '2'])
	})

	it('can create a single list', () => {
		expect(singleton('Anything')).to.eql(['Anything'])
	});

	it('can concat empty lists', () => {
		expect(concat([[], [], []])).to.eql([])
	});

	it('can concat lists of one entry', () => {
		expect(concat([['A'], ['b']])).to.eql(['A', 'b'])
	});

	it('can concat lists of multiple', () => {
		expect(concat([['A', 'a'], ['B', 'b']])).to.eql(['A', 'a','B', 'b'])
	});

	it('can concat lists of multiple', () => {
		expect(concat([['A', 'a'], ['B', 'b'], ['C']])).to.eql(['A', 'a','B', 'b', 'C'])
	});

	it('list can be empty list', () => {
		expect(concat([['A', 'a'], [], ['C']])).to.eql(['A', 'a', 'C'])
	});
})
