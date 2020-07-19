import { expect } from 'chai'
import { maybe, none, Some, some, toEither } from '../src/maybe';
import { either, Either, left, right, toMaybe } from '../src/either';

describe('Simple Algebraic Data Types - https://bartoszmilewski.com/2015/01/13/simple-algebraic-data-types/', () => {
	describe('isomorphism between \'Maybe a\' and \'Either () a\'', () => {

		interface Any {
			any: string
		}

		const anything: Any = { any: 'thing' };
		const maybeA = some(anything)
		const nothing = none()
		const rightA = right(anything)
		const leftA = left(undefined)

		expect(maybe<Any, Either<never, Any>>(right)(maybeA)).to.eql(rightA)
		expect(either<never, Any, Some<Any>>(() => {throw Error('Never!')})(some)(rightA)).to.eql(maybeA)

		expect(toEither(() => left(undefined))(right)(nothing)).to.eql(leftA)
		expect(toMaybe(some)(leftA)).to.eql(nothing)
	});
});