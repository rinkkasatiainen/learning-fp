import { expect } from 'chai'
import { get, Maybe, none, just, id } from '../src/maybe';

describe('Functors  - https://bartoszmilewski.com/2015/01/20/functors/', () => {
	describe('1 - Can we turn the Maybe type constructor into a functor by defining', () => {
		// Maybe :: a -> Nothing | Just a
		// type constructor:  a ->

		const maybe: <A>(x: A) => Maybe<A> = x => !!x ? just(x) : none()

		const fmap: <A, B>(f: (x: A) => B) => (y: Maybe<A>) => Maybe<B> =
			f => maybe => {
				if (maybe.isJust) {
					return just(f(get(maybe)))
				}
				return none()
			}

		describe('fmap follows function laws', () => {

			it('preserves identity', () => {
				expect(fmap(id)(none())).to.eql(none())
				expect(fmap(id)(just('anything'))).to.eql(just('anything'))
			})

			it(' is composable', () => {
				const plus2: (x: number) => number = x => x + 2
				const times3: (x: number) => number = x => x * 3

				expect(fmap(times3)(fmap(plus2)(just(3)))).to.eql(just(15))
				expect(fmap(times3)(fmap(plus2)(just(3)))).to.eql(just(times3(plus2(3))))
			})

			it('composes one function ', () => {
				expect(fmap((x: number) => x + 1)(none())).to.eql(none())
				expect(fmap((x: number) => x + 1)(just(2))).to.eql(just(3))
			})
		})

		it('1) cannot ignore both arguments', () => {
			const plus1: (x: number) => number = x => x + 1
			expect(fmap(plus1)(none())).to.eql(none())
			expect(fmap(plus1)(just(1))).to.not.eql(none())
		})
	});

	describe('2 - reader monad', () => {

	});
});
