import {expect} from 'chai'
import {Tuple} from '../../src/state'
import {Just, matcherMaybe, Maybe} from '../../src/maybe'
import {then} from '../../src/maybe/then'
import {identity} from '../../src/maybe/identity'
import {map} from '../../src/maybe/map'
import {flip} from '../../src/maybe/flip'
import {flatten, flattenWithNoThen} from '../../src/maybe/flatten'
import {fmap} from '../../src/maybe/fmap'


const maybe: <A>(x: A) => Maybe<A> = x => {
    if (x) {
        return {_value: x, _maybeType: 'some'}
    }
    return {_maybeType: 'none'}
}

describe('Both, Maybe? I Don’t Think That’s an Option', () => {

    describe('maybe', () => {

        it('Can be Nothing', () => {
            expect(maybe(null)).to.eql({_maybeType: 'none'})
        })
        it('Can be Something', () => {
            expect(maybe(1)).to.eql({_value: 1, _maybeType: 'some'})
        })
    })
    const ofMaybe: <T>(x: T) => (y: boolean) => Maybe<T> = _value => res => res ? {
        _value,
        _maybeType: 'some',
    } : {_maybeType: 'none'}
    const validateName: (x: string) => Maybe<string> = (x => ofMaybe(x)(x.length > 5))
    const validateAge: (x: number) => Maybe<number> = (x => ofMaybe(x)(x > 10))
    const none: () => Maybe<never> = () => ({_maybeType: 'none'})
    const just: <A>(x: A) => Maybe<A> = x => ({_maybeType: 'some', _value: x})

    describe('can validate person', () => {

        const validatePerson: (name: string, age: number) => Maybe<Tuple<string, number>> =
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            (name, age) => matcherMaybe({
                none,
                some: (_name: Just<string>) => matcherMaybe<number, Maybe<Tuple<string, number>>>({
                    none,
                    some: _age => ({_maybeType: 'some', _value: [_name._value, _age._value]}),
                })(validateAge(age)),
            })(validateName(name))
        it('can validate person', () => {
            expect(validatePerson('long name', 15)).to.eql(just(['long name', 15]))
        })
        it('a person with too short name is not valid', () => {
            expect(validatePerson('Aki', 15)).to.eql(none())
        })
        it('a person too young is not valid', () => {
            expect(validatePerson('Aki Salmi', 10)).to.eql(none())
        })
    })

    describe('can turn it into a higher-order-function', () => {

        const thenFunction: <A, B>(x: Maybe<A>) => (f: (a: A) => Maybe<B>) => Maybe<B> =
            <A>(m: Maybe<A>) => <B>(f: (a: A) => Maybe<B>) => matcherMaybe({
                none,
                some: (val: Just<A>) => f(val._value),
            })(m)

        const validatePerson: (name: string, age: number) => Maybe<Tuple<string, number>> =
            (name, age) =>
                thenFunction<string, Tuple<string, number>>(validateName(name))(_name =>
                    thenFunction<number, Tuple<string, number>>(validateAge(age))(_age => just([_name, _age])),
                )
        it('can validate person', () => {
            expect(validatePerson('long name', 15)).to.eql(just(['long name', 15]))
        })
        it('a person with too short name is not valid', () => {
            expect(validatePerson('Aki', 15)).to.eql(none())
        })
        it('a person too young is not valid', () => {
            expect(validatePerson('Aki Salmi', 10)).to.eql(none())
        })

    })

    describe('can map on a Maybe', () => {
        const mapMaybe: <A, B>(f: (a: A) => B) => (m: Maybe<A>) => Maybe<B> =
            <A, B>(f: (a: A) => B) => (m: Maybe<A>) => matcherMaybe({
                none: () => none(),
                some: (val: Just<A>) => just(f(val._value)),
            })(m)

        it('can map', () => {
            const double = (x: number) => x * x

            expect(mapMaybe(double)(just<number>(10))).to.eql(just(100))
        })
    })

    describe('can flatten a Maybe', () => {
        const flattenFunction: <A>(m: Maybe<Maybe<A>>) => Maybe<A> =
            <A>(m: Maybe<Maybe<A>>) => matcherMaybe({
                none,
                some: (val: Just<Maybe<A>>) => val._value,
            })(m)

        it('can flatten it', () => {
            expect(flattenFunction(just(just(10)))).to.eql(just(10))
        })
    })

    describe('can flatten two Maybes with `then`', () => {
        const flattenFunction: <A>(m: Maybe<Maybe<A>>) => Maybe<A> =
            <A>(m: Maybe<Maybe<A>>) => then<Maybe<A>, A>(m)(identity)

        it('can flatten it', () => {
            expect(flattenFunction(just(just(10)))).to.eql(just(10))
        })

        it('can flatten with flip', () => {
            const flattenFuncWithFlip: <A>(m: Maybe<Maybe<A>>) => Maybe<A> =
                // <A, B>(m: Maybe<Maybe<A>>) =>
                //    flip<Maybe<Maybe<A>>, (a: Maybe<A>) => Maybe<A>, Maybe<A>>(then)((x) => identity(x))(m)
                flip(then)(identity)

            expect(flattenFuncWithFlip(just(just(3456)))).to.eql(just(3456))
        })
    })

    describe('flip function', () => {
        const spy: <A, B>(arg1: A) => (arg2: B) => { getArgs: () => { arg1: A; arg2: B } } =
            (arg1) => (arg2) => ({
                getArgs: () => ({arg1, arg2}),
            })

        const flipFunction: <A, B, C>(f: (arg1: A) => (arg2: B) => C) => (a2: B) => (a1: A) => C =
            f => a2 => a1 => f(a1)(a2)


        it('can spy arguments', () => {
            expect(spy(1)('two').getArgs()).to.eql({arg1: 1, arg2: 'two'})
        })
        it('can flip arguments', () => {
            const f = flipFunction(spy)
            expect(f(1)('two').getArgs()).to.eql({arg1: 'two', arg2: 1})
        })
    })

    describe('can implement `then` with `map` reversed', () => {
        const thenF: <A, B>(x: Maybe<A>) => (f: (a: A) => Maybe<B>) => Maybe<B> =
            <A, B>(m: Maybe<A>) => (f: (a: A) => Maybe<B>) => {
                const flippedMap = flip<(a: A) => Maybe<B>, Maybe<A>, Maybe<Maybe<B>>>(map)
                return flattenWithNoThen(flippedMap(m)(f))
            }

        const add10: (m: Maybe<number>) => Maybe<number> =
            (m: Maybe<number>) => thenF<number, number>(m)(x => just(x + 10))


        it('can flatten it', () => {
            expect(add10(just<number>(10))).to.eql(just(20))
        })
        it('can flatten it with flipped then', () => {
            const add10Flipped: (m: Maybe<number>) => Maybe<number> = flip(thenF)(x => just(x + 10))

            expect(add10Flipped(just<number>(11))).to.eql(just(21))
        })
        it('with thenFuction unrolled (do I get with less generics typing)', () => {
            const thenFunc: <A, B>(x: Maybe<A>) => (f: (a: A) => Maybe<B>) => Maybe<B> =
                <A, B>(m: Maybe<A>) => (f: (a: A) => Maybe<B>) =>
                    flattenWithNoThen(flip<(a: A) => Maybe<B>, Maybe<A>, Maybe<Maybe<B>>>(map)(m)(f))

            const liftsToMaybe: (x: number) => Maybe<number> = x => just(x ** 3)

            const unrolledF = flip(thenFunc)(liftsToMaybe)

            expect(unrolledF(just(8))).to.eql(just(512))
        })
        it('with all unrolled 2', () => {
            const liftsToMaybe: (x: number) => Maybe<number> = x => just(x ** 3)

            /* eslint-disable max-len */
            // const unrolledFSpecificToNumber: (m: Maybe<number>) => Maybe<number> =
            //     flip<Maybe<number>, (a: number) => Maybe<number>, Maybe<number>>
            //         (m => f =>
            //             flattenWithNoThen(flip<(a: number) => Maybe<number>, Maybe<number>, Maybe<Maybe<number>>>(map)(m)(f)),
            //         )( liftsToMaybe )

            const unrolledF: <A extends number, B extends number>(m: Maybe<A>) => Maybe<B> =
                <A extends number, B extends number>(x: Maybe<A>) =>
                    flip<Maybe<A>, (a: A) => Maybe<B>, Maybe<B>>
                        (
                        m => f => flattenWithNoThen(flip<(a: A) => Maybe<B>, Maybe<A>, Maybe<Maybe<B>>>(map)(m)(f)),
                        )(
                        liftsToMaybe as (x: A) => Maybe<B>,
                        )(x)

            // const unrolledFWithExtraTyping: <A extends number, B extends number>(m: Maybe<A>) => Maybe<B> =
            //     <A extends number, B extends number>(x: Maybe<A>) => flip<Maybe<A>, (a: A) => Maybe<B>, Maybe<B>>(m => f => {
            //         const m1: Maybe<Maybe<B>> = flip<(a: A) => Maybe<B>, Maybe<A>, Maybe<Maybe<B>>>(map)(m)(f)
            //         return flattenWithNoThen(m1)
            //     })(liftsToMaybe as (x: A) => Maybe<B>)(x)
            /* eslint-enable max-len */

            expect(unrolledF(just(8))).to.eql(just(512))
        })
    })

    describe('fmap', () => {
        const thenF: <A, B>(x: Maybe<A>) => (f: (a: A) => Maybe<B>) => Maybe<B> =
            <A, B>(m: Maybe<A>) => (f: (a: A) => Maybe<B>) => flatten(fmap<A, B>(f)(m))

        const times30: (m: Maybe<number>) => Maybe<number> =
            (m: Maybe<number>) => thenF<number, number>(m)(x => just(x * 30))

        it('can flatten it', () => {
            expect(times30(just<number>(10))).to.eql(just(300))
        })
    })
})
