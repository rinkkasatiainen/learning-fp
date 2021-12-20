import {expect} from 'chai'
import {get, Maybe, none, just, id, fmap} from '../src/maybe'

const plus2: (x: number) => number = x => x + 2
const times3: (x: number) => number = x => x * 3

describe('Functors  - https://bartoszmilewski.com/2015/01/20/functors/', () => {
    describe('1 - Can we turn the Maybe type constructor into a functor by defining', () => {
        // Maybe :: a -> Nothing | Just a
        // type constructor:  a ->     returns ( Nothing | Just a )

        const maybeTypeConstrToNothing: <A>(x: A) => Maybe<A> = () => none()

        describe('fmap follows function laws', () => {
            describe('preserves identity', () => {
                it('identifies as self', () => {
                    expect(id(maybeTypeConstrToNothing({foo: 'bar'}))).to.eql(none())
                })
                it('can be called many times', () => {
                    expect(id(id(maybeTypeConstrToNothing({foo: 'bar'})))).to.eql(none())
                })
            })

            //  fmap (g . f) (Just x)
            // = { definition of fmap }
            //   Just ((g . f) x)
            // = { definition of composition }
            //   Just (g (f x))
            // = { definition of fmap }
            //   fmap g (Just (f x))
            // = { definition of fmap }
            //   fmap g (fmap f (Just x))
            // = { definition of composition }
            //   (fmap g . fmap f) (Just x)

            it('composes one function ', () => {
                const func = (x: Maybe<number>) => fmap(times3)(fmap(plus2)(x))
                expect(func( maybeTypeConstrToNothing(4))).to.eql(none())
            })
        })

        it('1) cannot ignore both arguments', () => {
            const plus1: (x: number) => number = x => x + 1
            expect(fmap(plus1)(none())).to.eql(none())
            expect(fmap(plus1)(just(1))).to.not.eql(none())
        })
    })
    describe('preserves composition', () => {
        it('does magic', () => {

            expect(fmap(times3)(fmap(plus2)(just(3)))).to.eql(just(15))
            // is same as:
            const func: (x: number) => Maybe<number> = fmap(fmap(times3))
            type F1<A> = (x: A) => A
            const funcs: Array<F1<number>> = [times3, plus2]
            const compose = (val: Maybe<number>) => funcs.reduce((prev, curr) => fmap(curr)(prev), val)
            expect(compose(just(5))).to.eql(just(17))

            // other
            expect(fmap(times3)(fmap(plus2)(just(3)))).to.eql(just(times3(plus2(3))))
        })
    })

    describe('2 - reader monad', () => {

    })
})
