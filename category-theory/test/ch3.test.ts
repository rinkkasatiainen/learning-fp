import {expect} from 'chai'

describe('Categories Great and Small, https://bartoszmilewski.com/2014/12/05/categories-great-and-small/', () => {

    describe('Bool as set of Two values', () => {
        class Bool {
            /* eslint-disable mocha/no-setup-in-describe */
            private _value: boolean

            public constructor(val: boolean) {
                this._value = val
            }

            public and(bool: Bool) {
                return new Bool(this._value && bool._value)
            }

            public or(bool: Bool) {
                return new Bool(this._value || bool._value)
            }

            /* eslint-enable mocha/no-setup-in-describe */
        }

        const truthy = new Bool(true)
        const falsey = new Bool(false)

        describe('and', () => {
            it(' has identity morphism', () => {
                expect(truthy).to.eql(truthy.and(new Bool(true)))
                expect(falsey).to.eql(falsey.and(new Bool(true)))
            })

            it('has morphism to associative', () => {
                const andTrue = () => new Bool(true)
                const andFalse = () => new Bool(false)
                expect(truthy.and(andTrue()).and(andTrue())).to.eql(truthy)
                expect(truthy.and(andTrue()).and(andFalse())).to.eql(falsey)
            })
        })

        describe('or', () => {
            it(' has identity morphism', () => {
                expect(truthy).to.eql(truthy.or(new Bool(false)))
                expect(falsey).to.eql(falsey.or(new Bool(false)))
            })

            it('has morphism to associative', () => {
                const andTrue = () => new Bool(true)
                const andFalse = () => new Bool(false)
                expect(truthy.or(andFalse()).or(andFalse())).to.eql(truthy)
                expect(falsey.or(andTrue()).or(andTrue())).to.eql(truthy)
                expect(falsey.or(andTrue()).or(andFalse())).to.eql(truthy)
                expect(falsey.or(andFalse()).or(andFalse())).to.eql(falsey)
            })
        })
    })

    describe('adding modulo 3', () => {

        interface Mod<T> {
            value: T;
        }

        type Modulo3 = Mod<1> | Mod<2> | Mod<3>
        const mod3Of: (x: number) => Modulo3 = value => (({value: value % 3}) as Modulo3)
        const add: (x: Modulo3, y: number) => Modulo3 = (modulo, append) => mod3Of( modulo.value + append)

        it('has identity function', () => {
            expect(add(mod3Of(1), 0)).to.eql(mod3Of(1))
            expect(add(mod3Of(2), 0)).to.eql(mod3Of(2))
            expect(add(mod3Of(3), 0)).to.eql(mod3Of(3))
        })

        it('probably requires something else, too')
    })
})
