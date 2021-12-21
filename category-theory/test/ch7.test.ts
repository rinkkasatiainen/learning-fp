import {expect} from 'chai'
import {fmap, id, just, Maybe, none} from '../src/maybe'

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
                expect(func(maybeTypeConstrToNothing(4))).to.eql(none())
            })
        })

        it('1) cannot ignore both arguments', () => {
            const plus1: (x: number) => number = x => x + 1
            expect(fmap(plus1)(none())).to.eql(none())
            expect(fmap(plus1)(just(1))).to.not.eql(none())
        })
    })
    describe('preserves composition', () => {
        it('a function composition', () => {
            const compositeOfJustValues = (maybeVal: Maybe<number>) => fmap(times3)(fmap(plus2)(maybeVal))
            const compositeOfPlainValue = (x: number) => times3(plus2(x))

            expect(compositeOfJustValues(just(3))).to.eql(just(15))
            expect(compositeOfJustValues(just(3))).to.eql(just(compositeOfPlainValue(3)))
        })

        it('composition of array of functions', () => {
            // is same as:
            type MorphismInsideCategory<A> = (x: A) => A
            const funcs: Array<MorphismInsideCategory<number>> = [times3, plus2]

            const buildCompositionOfMaybeValues:
                <T>(funcs1: Array<MorphismInsideCategory<T>>) => (val: Maybe<T>) => Maybe<T> =
                morphisms => val => morphisms.reduce((prev, curr) => fmap(curr)(prev), val)
            const buildCompositionOfPlainValue:
                <T>(funcs: Array<MorphismInsideCategory<T>>) => (val: T) => T =
                morphisms => val => morphisms.reduce((prev, curr) => curr(prev), val)

            // composition of Maybe Values
            expect(buildCompositionOfMaybeValues(funcs)(just(5))).to.eql(just(17))
            expect(buildCompositionOfPlainValue(funcs)(5)).to.eql(17)

            // can be lifted!
            const composeFmapJust = buildCompositionOfMaybeValues(funcs)(just(63))
            const justOfMap = just(buildCompositionOfPlainValue(funcs)(63))
            expect(composeFmapJust).to.eql(justOfMap)
        })
    })

    describe('2 - reader monad', () => {

    })
})
