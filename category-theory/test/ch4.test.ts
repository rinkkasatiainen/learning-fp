import {expect} from 'chai'

interface Maybe<T extends boolean> {
    isValid: T;
}

interface Some<T> extends Maybe<true> {
    value: T;
}

type None = Maybe<false>

type Optional<T> = Some<T> | None

const none: () => None = () => ({isValid: false})
const some: <A>(value: A) => Some<A> = value => ({isValid: true, value})

const optionalOf: <A>(x?: A) => Optional<A> = value => {
    if (value === null || value === undefined) {
        return none()
    }
    return some(value)
}
const id: <A>(value: A) => Optional<A> =
    value => optionalOf(value)

type MapOptionalFunc<A, B> = (value: A) => Optional<B>;
const mapOptional: <A, B>(optional: Optional<A>) => (y: MapOptionalFunc<A, B>) => Optional<B> =
    <A>(optional: Optional<A>) => <B>(func: (value: A) => Optional<B>) => {
        if (optional.isValid) {
            return func(optional.value)
        }
        return optionalOf<B>(undefined)
    }
describe('Kleisli Categories, https://bartoszmilewski.com/2014/12/23/kleisli-categories/', () => {
    describe('1 - Kleisli category for a partial function', () => {

        it('has composition', () => {
            const optional: Optional<string> = optionalOf('something')

            const toUpper: (x: string) => Optional<string> = (input: string) => optionalOf<string>(input.toUpperCase())

            const upcase = mapOptional(optional)(toUpper)
            expect(upcase).to.eql(optionalOf('something'.toUpperCase()))
        })

        it('has identity', () => {
            const optional: Optional<string> = optionalOf('something')
            const toUpper: (x: string) => Optional<string> = (input: string) => optionalOf<string>(input.toUpperCase())

            expect(optional).to.eql(mapOptional(optional)(id))
            expect(mapOptional(optional)(toUpper)).to.eql(
                mapOptional<string, string>(mapOptional<string, string>(optional)(id))(toUpper)
            )
        })
    })

    const toNaturalNumber: (num: number) => Optional<number> = num => {
        if (num === 0) {
            return none()
        }
        return some(num)
    }
    const reciprocal: MapOptionalFunc<number, number> = num => some(1 / num)

    const safeReciprocal: (x: Optional<number>) => Optional<number> =
        (optional) => mapOptional<number, number>(optional)(reciprocal)
    describe('2 - safeReciprocal', () => {
        it('is not calculated for 0', () => {
            expect(toNaturalNumber(0)).to.eql(none())
            expect(safeReciprocal(toNaturalNumber(0))).to.eql(none())
        })

        it('can calculate', () => {
            expect(safeReciprocal(toNaturalNumber(10))).to.eql(some(1 / 10))
            expect(safeReciprocal(toNaturalNumber(5))).to.eql(some(1 / 5))
        })
    })

    type NaturalNumber = Optional<number>
    const safeRoot: (x: NaturalNumber) => NaturalNumber =
            possiblyNaturalNumber => mapOptional<number, number>(possiblyNaturalNumber)(x => some(Math.sqrt(x)))

    describe('3 - safeRoot - reciprocal', () => {
        it('can calcuate root for NaturalNumber', () => {
            expect(safeRoot(toNaturalNumber(25))).to.eql(some(5))
            expect(safeRoot(toNaturalNumber(0))).to.eql(none())
        })

        const safeRootReciprocal: (x: NaturalNumber) => NaturalNumber = optional => safeRoot(safeReciprocal(optional))
        it('can calculate safe root reciprocal', () => {
            expect(safeReciprocal(toNaturalNumber(25))).to.eql(some(0.04))
            expect(safeRootReciprocal(toNaturalNumber(25))).to.eql(some(0.2))
        })

    })

})
