import {expect} from 'chai'
import {matcher, Pattern, PatternKeys, PatternMatchingType} from '../src/matcher'

type PatternString<K extends PatternKeys, B> = {
    [key in K]: (str: K) => B
}
export const matchString: <A extends string, B>(pattern: PatternString<A, B>) => (str: A) => B =
    pattern => str => pattern[str](str)

type MaybeKeys = 'none' | 'some'


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

            const matcherMaybe:
                <A, B>(pattern: Pattern<MaybeKeys, A, B>) => (maybe: PatternMatchingType<MaybeKeys>) => B =
                <A, B>(p: Pattern<MaybeKeys, A, B>) => s => matcher<MaybeKeys, A, B>(p)(s)

            it('matches something', () => {
                const res = matcherMaybe<Maybe<number>, Maybe<string>>({
                    none: shape => shape,
                    some: shape => {
                        return just(shape._value.toString(10))
                    },
                })(just(3))

                expect(res._type).to.eql('some')
                if (res._type === 'some') {
                    expect(res._value).to.eql('3')
                }
            })

            it('matches nothing', () => {
                const f = matcherMaybe<Maybe<number>, Maybe<string>>({
                    none: shape => shape,
                    some: shape => {
                        throw new Error(`should not have been called - ${shape._type}`)
                    },
                })
                expect(f(none())).to.eql(none())
            })

            it('matches a maybe using generic', () => {
                const res = matcher<MaybeKeys, Maybe<number>, Maybe<string>>({
                    none: shape => shape,
                    some: shape => just(shape._value.toString(10)),
                })(just(3))
                expect(res._type).to.eql('some')
                if (res._type === 'some') {
                    expect(res._value).to.eql('3')
                }
            })
        })

        describe('just cannot create wrong types', () => {
            type A = PatternMatchingType<'a'>;
            type B = PatternMatchingType<'b'>;

            type X = A | B

            // eslint-disable-next-line mocha/no-setup-in-describe
            const f = matcher<'a' | 'b', X, string>({
                a: (shape) => `returned: ${shape._type}`,
                b: (shape) => `returned: ${shape._type}`,
            })

            it('can create a custom type', () => {
                expect(f({_type: 'a'})).to.eql('returned: a')
                expect(f({_type: 'b'})).to.eql('returned: b')
            })
            it('even typescript complaints.', () => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                expect(() => f({_type: 'c'})).to.throw('pattern[shape._type] is not a function')
            })
        })
    })
})
