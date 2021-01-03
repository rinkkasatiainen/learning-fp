import {expect} from 'chai'

describe('The Essence of Composition', () => {
    const compose: <A, B, C>(f: (x: A) => B, g: (y: B) => C) => (x: A) => C =
        (f, g) => x => g(f(x))
    const id: <T>(x: T) => T = x => x

    describe('Challenge 1 -  identity function', () => {
        it('takes any string and returns the string', () => {
            const a = 'any string'

            expect(id(a)).to.equal(a)
        })
        it('takes any number and returns the number', () => {
            const a = 23654.345675

            expect(id(a)).to.equal(a)
        })
    })

    describe('Composition function', () => {
        const plusTwo: (x: number) => number = x => x + 2
        const timesThree: (x: number) => number = x => x * 3
        const toStr: (x: string) => number = x => parseInt(x, 10)

        it('works on types A', () => {
            expect(compose(plusTwo, timesThree)(1)).to.equal(9)
        })

        it('works on between different types', () => {
            expect(compose(toStr, timesThree)('10')).to.equal(30)
        })

        it('works with identity', () => {
            const res1 = compose(id, toStr)
            const res2 = compose(toStr, id)
            const actual = toStr

            const input = '4567'

            expect(res1(input)).to.equal(res2(input))
            expect(res1(input)).to.equal(actual(input))
        })
    })
})

