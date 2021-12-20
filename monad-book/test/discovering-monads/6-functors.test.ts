import { expect } from 'chai'

interface RespondsToMap<A, B> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
	map: (x: A) => RespondsToMap<B, any>;
}
interface Functor<A, B> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
	map: (f: (a: A) => B) => (a: Functor<A, B>) => Functor<B, unknown>;
}
type Fmap<A, B> = (functor: Functor<A, B>) => (a: A) => B
interface HasMap<A,B> { map: (fn: (x: A) => B) => B}

function hasMap<A, B>(m: {map?: (fn: (a: A) => B) => B } ): m is HasMap<A, B>{
    return 'map' in m
}

describe('Functors', () => {
    const mapToString: (x: number) => string = num => `${ num }`

    describe('a basic functor', () => {
        const basicFunction: (x: number) => number = x => x + 1


        const plainFunctor: Functor<number, string> =  ({
            map: fn => num => num.map(fn),
        })
        it('provides a function \'map\' - a \'functor map\'', () => {
            const f = plainFunctor.map(mapToString)
            expect(f([30])).to.eql(['30'])
        })

        it('lifts to M with fmap', () => {
            const fmap: <A,B>(basicFn: (x: A) => B) => (x: Functor<A, B>) =
                <A, B>(basicFn: (a: A) => B) => {
                    return { map: f => a => {
                            return a.map(f)
                        }}
                }

            const canMapIntegers: Functor<number, number> = fmap(basicFunction)


        })
        // it(`can make a fmap`, () => {
        // 	const fmap: Fmap<number, string> = plainFunctor => (x: number[]) =>
        //
        // 	const f = fmap(Math.sqrt)
        // 	expect(f([30])).to.eql('30')
        // })
    })
})
