import { expect } from 'chai'
import {just} from '../../src/maybe/just'

interface Functor<A> {
	map: <B>(f: (a: A) => B) => Functor<B>;
}

describe('Functors', () => {
    const mapToString: (x: number) => string = num => `${ num }`

    describe('a basic functor', () => {
        const basicFunction: (x: number) => number = x => x + 1


        const plainFunctor: (x: number[]) => Functor<number> = (num) => ({
            map: fn => num.map(fn),
        })
        it('provides a function \'map\' - a \'functor map\'', () => {
            const f = plainFunctor([30]).map
            expect(f(mapToString)).to.eql(['30'])
        })

        it('lifts to M with fmap', () => {
            const fmap: <A,B>(basicFn: (x: A) => B) => (x: Functor<A>) => Functor<B> =
                <A, B>(basicFn: (a: A) => B) => (functor: Functor<A>) => {
                    return functor.map<B>(basicFn)
                }

            const canMapIntegers: (x: Functor<number>) => Functor<number> = fmap(basicFunction)

            const maybe = just(5)

        })
        // it(`can make a fmap`, () => {
        // 	const fmap: Fmap<number, string> = plainFunctor => (x: number[]) =>
        //
        // 	const f = fmap(Math.sqrt)
        // 	expect(f([30])).to.eql('30')
        // })
    })
})
