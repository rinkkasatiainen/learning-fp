import {expect} from 'chai'

type PatternKeys = string | number | symbol
type PatternString<K extends PatternKeys, B> = {
    [key in K]: (str: K) => B
}
export const matchString: <A extends string, B>(pattern: PatternString<A, B>) => (str: A) => B =
    pattern => str => pattern[str](str)

type MaybeKeys = 'none' | 'some'

type TypeMatcherMap<K extends PatternKeys, A, B> = {
    [key in K]: A extends { _type: key } ? A : never
}

interface PatternMatchingType<K extends PatternKeys> {
    _type: K;
}

type TypeTypeMap<K extends PatternKeys, A, B> = TypeMatcherMap<K, A, B>

type Pattern<K extends PatternKeys, A, B> = {
    [key in K]: (shape: TypeTypeMap<K, A, B>[key]) => B
}


export const matcher: <K extends PatternKeys, A, B>(pattern: Pattern<K, A, B>) => (maybe: PatternMatchingType<K>) => B =
    // The type casting seems to work. As an alternative to 'any'
    pattern => m => pattern[m._type](m as unknown as never)

export const matcherMaybe: <A, B>(pattern: Pattern<MaybeKeys, A, B>) => (maybe: Maybe<A>) => B =
    // The type casting seems to work. As an alternative to 'any'
    pattern => m => pattern[m._type](m as unknown as never)


describe('Pattern Matching', () => {
    describe('matches strings', () => {
        type Keys = 'a' | 'b'
        it('matches normal strings', () => {
            const res = matchString<Keys, string>({
                a: str => `string-${str}`,
                b: str => `string-${str}`,
            })('a')
            expect(res).to.eql('string-a')
        })
        it('matches with void', () => {
            let val = ''
            matchString<Keys, void>({
                a: str => {
                    val = `string-${str}`
                },
                b: str => {
                    val = `string-${str}`
                },
            })('b')
            expect(val).to.eql('string-b')
        })
    })

    describe('matches custom types', () => {
        describe('Maybe', () => {
            type Nothing = PatternMatchingType<'none'>
            interface Just<A> extends PatternMatchingType<'some'> {
                _value: A;
            }

            type Maybe<A> = Nothing | Just<A>
            const just: <A>(a: A) => Just<A> = _value => ({_type: 'some', _value})
            const none: () => Nothing = () => ({_type: 'none'})

            it('matches a maybe', () => {
                const res = matcherMaybe<number, Maybe<string>>({
                    none,
                    some: shape => {
                        const shape1: Just<number> = shape
                        return just(shape1._value.toString(10))
                    },
                })(just(3))

                expect(res._type).to.eql('some')
                if (res._type === 'some') {
                    expect(res._value).to.eql('3')
                }
            })

            it('matches a maybe using generic', () => {
                const res = matcher<MaybeKeys, Maybe<number>, Maybe<string>>({
                    none,
                    some: shape => just(shape._value.toString(10)),
                })(just(3))
                expect(res._type).to.eql('some')
                if (res._type === 'some') {
                    expect(res._value).to.eql('3')
                }
            })
        })
    })
})
