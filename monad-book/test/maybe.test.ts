import {expect} from 'chai'
import {Tuple} from '../src/state'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
type MaybeKeys = 'none' | 'some'

interface MaybeType<T extends MaybeKeys> {
    _maybeType: T;
}

type Nothing = MaybeType<'none'>

interface Just<A> extends MaybeType<'some'> {
    _value: A;
}

type Maybe<A> = Nothing | Just<A>

const maybe: <A>(x: A) => Maybe<A> = x => {
    if (x) {
        return {_value: x, _maybeType: 'some'}
    }
    return {_maybeType: 'none'}
}

type MaybeMatcherMap<A, B> = {
    [K in MaybeKeys]: A extends { _maybeType: K } ? A : never
}
type MaybeTypeMap<A> = MaybeMatcherMap<Maybe<A>, A>
type Pattern<A, B> = {
    [K in MaybeKeys]: (shape: MaybeTypeMap<A>[K]) => B
}

export const matcherMaybe: <A, B>(pattern: Pattern<A, B>) => (maybe: Maybe<A>) => B =
    // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-explicit-any
    pattern => m => pattern[m._maybeType](m as any)


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
    const none: () => Nothing = () => ({_maybeType: 'none'})
    const just: <A>(x: A) => Just<A> = x => ({_maybeType: 'some', _value: x})

    describe('can validate person', () => {

        const validatePerson: (name: string, age: number) => Maybe<Tuple<string, number>> =
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

        const then: <A, B>(x: Maybe<A>) => (f: (a: A) => Maybe<B>) => Maybe<B> =
            <A>(m: Maybe<A>) => <B>(f: (a: A) => Maybe<B>) => matcherMaybe({
                none,
                some: (val: Just<A>) => f(val._value),
            })(m)

        const validatePerson: (name: string, age: number) => Maybe<Tuple<string, number>> =
            (name, age) =>
                then<string, Tuple<string, number>>(validateName(name))(_name =>
                    then<number, Tuple<string, number>>(validateAge(age))(_age => just([_name, _age]))
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

    });
})
