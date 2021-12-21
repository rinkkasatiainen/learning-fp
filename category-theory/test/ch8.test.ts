import {expect} from 'chai'
import {identity} from '../src/identity'

interface Bifunctor<A, B> {
    bimap: <C, D>(f: (a: A) => C) => (g: (b: B) => D) => Bifunctor<C, D>;
}

interface Pair<A, B> extends Bifunctor<A, B> {
    a: A;
    b: B;
    bimap: <C, D>(f: (a: A) => C) => (g: (b: B) => D) => Pair<C, D>;
}

const makePair: <A, B>(a: A, b: B) => Pair<A, B> = <A, B>(a: A, b: B) => ({
    a,
    b,
    bimap: <C, D>(f: (a: A) => C) => (g: (b: B) => D) => makePair(f(a), g(b)),
})

const plus3: (x: number) => number = addend => addend + 3
const times: (y: number) => (x: number) => number = x => y => x * y
const doubling: (text: string) => string = text => `${text}-${text}`

describe('Functoriality  - https://bartoszmilewski.com/2015/02/03/functoriality/', () => {

    describe('bifunctor', () => {
        const bifunctor = <A, B>(a: A, b: B): Bifunctor<A, B> => ({
            bimap: f => g => bifunctor(f(a), g(b)),
        })

        function spyOnTheValuesOfBifunctor(result: Bifunctor<unknown, unknown>) {
            const spyValues: unknown[] = []
            const reading: <T>(x: T) => T = t => {
                spyValues.push(t)
                return t
            }
            result.bimap(reading)(reading)
            return spyValues
        }

        it('works on plain bifunctor', () => {
            const bf = bifunctor(-23, 'string--')

            const result = bf.bimap(times(2))(doubling)
            // verify what is inside result
            const spyValues = spyOnTheValuesOfBifunctor(result)
            expect(spyValues).to.eql([-46, 'string---string--'])
        })

        it('preserves identity', () => {
            const bf = bifunctor('Aki', 45)
            const result = bf.bimap(identity)(identity)

            const spyValues = spyOnTheValuesOfBifunctor(result)
            expect(spyValues).to.eql(['Aki', 45])
        })

        it('preserves composition', () => {
            const bf = bifunctor('Aki', 20)
            const f = (x: string) => identity(doubling(x))
            const g = (x: number) => times(-3)(plus3(x))
            const result = bf.bimap(f)(g)

            const compositeThenBifunctor = spyOnTheValuesOfBifunctor(result)
            expect(compositeThenBifunctor).to.eql(['Aki-Aki', -69])

            const r2 = bf.bimap<string, number>(doubling)(plus3).bimap(identity)(times(-3))
            const compositeOfBifunctor = spyOnTheValuesOfBifunctor(r2)
            expect(compositeThenBifunctor).to.eql(compositeOfBifunctor)

        })

        describe('Pair as bifunctor', () => {

            it('can make a custom bifunction', () => {
                const pair = makePair(30, 'text')

                const {a, b} = pair.bimap(plus3)(doubling) /* ? */
                expect({a, b}).to.eql({a: 33, b: 'text-text'})
            })
        })
    })
})
