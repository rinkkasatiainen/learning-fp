import { expect } from 'chai';

const memoize: <T, U>(pureFunc: (x: T) => U) => (x: T) => U = <T, U>(func: (x: T) => U) => {
	const cache: { [key: string]: U } = {}
	const getS: (x: T) => string = (x: T) => `${ x }`;

	return (args: T) => {
		if (!(getS(args) in cache)) {
			cache[getS(args)] = func(args)
		}
		return cache[getS(args)]
	}
}

describe('Types and Functions', () => {
	describe('memoize', function () {
		const times2: (x: number) => number = x => x * 2

		it('should call pure function', () => {
			const memoizedF = memoize(times2)

			expect(memoizedF(2)).to.equal(4)
		})

		it('should memoize the value', () => {
			let callCount = 0
			const loggingTimes2: (x: number) => number = arg => {
				callCount += 1
				return times2(arg)
			}
			const memoizedF = memoize(loggingTimes2)

			expect(memoizedF(3)).to.eql(6)
			expect(memoizedF(3)).to.eql(6)
			expect(callCount).to.eql(1)

		})
	});
	describe('memoize random', () => {
		it('in JS, it does not matter, if a function gets too many parameters, can memoize random this way', () => {
			let memoize1 = memoize(Math.random);
			const valueFor1 = memoize1(1)
			expect(memoize1(1)).to.eql(valueFor1)
			expect(memoize1(1)).to.eql(valueFor1)
		})
	})
})
