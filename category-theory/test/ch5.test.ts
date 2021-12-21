import {expect} from 'chai'

describe('Products and Coproducts - https://bartoszmilewski.com/2015/01/07/products-and-coproducts/', () => {

    interface LessThanHundred {
        value: number;
    }

    const upTo100: (augend: LessThanHundred) => (addend: number) => LessThanHundred = original => addend => {
        const res = original.value + addend

        return (res > 100) ? {value: 100} : {value: res}
    }

    /* eslint-disable mocha/no-setup-in-describe */
    const maxTo100: (x: number) => LessThanHundred = upTo100({value: 0})
    /* eslint-enable mocha/no-setup-in-describe */

    describe('terminal object', () => {
        it('is unique in unique isomorphic', () => {
            // const id: (x: LessThanHundred) => LessThanHundred = x => x

            const terminal1 = maxTo100(100)
            const terminal2 = maxTo100(200)

            const add1: (x: LessThanHundred) => LessThanHundred = augend => upTo100(augend)(1)

            expect(terminal1).to.eql(terminal2)
            expect(add1(terminal1)).to.eql(terminal2)
        })
    })

    describe('What is a product of two objects in a poset? Hint: Use the universal construction.', () => {
        // type Poset = number
    })

    interface LR<A extends boolean, B extends boolean> {
        isLeft: A;
        isRight: B;
    }

    interface Left<A> extends LR<true, false> {
        value: A;
    }

    interface Right<B> extends LR<false, true> {
        value: B;
    }

    type Either<A, B> = Left<A> | Right<B>

    const left: <A>(x: A) => Left<A> = value => ({isLeft: true, isRight: false, value})
    const right: <A>(x: A) => Right<A> = value => ({isRight: true, isLeft: false, value})

    describe('4 - Either', () => {
        const getLeft: <A>(x: Either<A, unknown>) => A = either => {
            if (either.isLeft) {
                return either.value
            }
            throw Error('cannot get Left of Right!')
        }
        const getRight: <A>(x: Either<unknown, A>) => A = either => {
            if (either.isRight) {
                return either.value
            }
            throw Error('cannot get Right of Left!')
        }

        it(' has left', () => {
            expect(getLeft(left('value'))).to.eql('value')
            expect(() => getLeft(right('value'))).to.throw()
        })
        it(' has right', () => {
            expect(getRight(right('value'))).to.eql('value')
            expect(() => getRight(left('value'))).to.throw()
        })
    })

    describe('5 - Show that Either is a “better” coproduct than int equipped with two injections:', () => {
        /* eslint-disable mocha/no-setup-in-describe */
        const i: (x: number) => number = x => x
        const j: (x: boolean) => number = x => x ? 0 : 1

        const either: <A, B, C>(onLeft: (a: A) => C) => (onRight: (b: B) => C) => (either: Either<A, B>) => C =
            onLeft => onRight => e => {
                if (e.isLeft) {
                    return (onLeft(e.value))
                }
                return (onRight(e.value))
            }

        const m: (x: Either<number, boolean>) => number = either<number, boolean, number>(i)(j)
        /* eslint-enable mocha/no-setup-in-describe */

        it('m factorizes i and j.', () => {
            expect(m(left(3))).to.eql(3)
            expect(m(left(4))).to.eql(4)
            expect(m(right(false))).to.eql(1)
            expect(m(right(true))).to.eql(0)
        })
    })

})
