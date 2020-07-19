import { expect } from 'chai'
import { maybe, none, Some, some } from '../src/maybe';
import { either, Either, left, right } from '../src/either';

describe('Simple Algebraic Data Types - https://bartoszmilewski.com/2015/01/13/simple-algebraic-data-types/', () => {
	describe('isomorphism between \'Maybe a\' and \'Either () a\'', () => {

		interface Any {
			any: string
		}

		const anything: Any = { any: 'thing' };
		const maybeA = some(anything)
		const nothing = none()
		const rightA = right(anything)
		const leftA = left(anything)


		// const toMaybe: <A>(x: Either<never, A>) => Maybe<A> = <A>(x: Either<never, A>) => either<never, A, Maybe<A>>(none)(some)(x)

		expect(maybe<Any, Either<never, Any>>(right)(maybeA)).to.eql(rightA)
		expect(either<never, Any, Some<Any>>(() => {throw Error('Never!')})(some)(rightA)).to.eql(maybeA)

		expect(maybe(left)(none))



	});
});