import { expect } from 'chai'

interface RespondsToMap<A, B> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
	map: (x: A) => RespondsToMap<B, any>;
}
interface Functor<A, B> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
	map: (f: (a: A) => B) => (a: RespondsToMap<A, B>) => RespondsToMap<B, any>;
}
type Fmap<A, B> = (functor: Functor<A, B>) => (a: A) => B

describe('Functors', () => {
    const mapToString: (x: number) => string = num => `${ num }`

    describe('a basic functor', () => {
        const plainFunctor: Functor<number, string> =  ({
            map: func => num => num.map(func),
        })
        it('provides a function \'map\' - a \'functor map\'', () => {
            const f = plainFunctor.map(mapToString)
            expect(f([30])).to.eql(['30'])
        })
        // it(`can make a fmap`, () => {
        // 	const fmap: Fmap<number, string> = plainFunctor => (x: number[]) =>
        //
        // 	const f = fmap(Math.sqrt)
        // 	expect(f([30])).to.eql('30')
        // })
    })
})
