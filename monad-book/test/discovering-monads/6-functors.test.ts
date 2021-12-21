import { expect } from 'chai'

interface Functor<A> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
	map: <B>(f: (a: A) => B) => (a: Functor<A>) => Functor<B>;
}
interface HasMap<A,B> { map: (fn: (x: A) => B) => B}

describe('Functors', () => {
    const mapToString: (x: number) => string = num => `${ num }`

    describe('a basic functor', () => {
        const basicFunction: (x: number) => number = x => x + 1


        const plainFunctor: Functor<number> =  ({
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
