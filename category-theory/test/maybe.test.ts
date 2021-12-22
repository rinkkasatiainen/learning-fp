import {expect} from 'chai'
import {makeJust, makeNone} from '../src/maybe'
import {identity} from '../src/identity'

const verifyKeys: <T>(keys: Array<keyof T>) => (obj: { [key in keyof T]: unknown }) => T[ keyof T] =
    <T>(keys: Array<keyof T>) => (obj: Record<string, unknown>) => keys.reduce((prev, key: keyof T) => ({...prev, [key]: obj[key]}), {})

const justString = makeJust('string')
const justNumber = makeJust(42)

const maskJustKeys = verifyKeys(['value', 'maybeType'])
const maskNoneKeys = verifyKeys(['maybeType'])
describe('Maybe', () => {

    describe('preservs identity', () => {
        it('just values', () => {
            // verify identity
            expect(maskJustKeys(identity(justString))).to.eql(maskJustKeys(makeJust('string')))
            // verify fmapped identity
            expect(maskJustKeys(justString.fmap(identity))).to.eql(maskJustKeys(justString))
            // also for numbers
            expect(maskJustKeys(justNumber.fmap(identity))).to.eql(maskJustKeys(justNumber))
        })

        it('none values', () => {
            expect(maskNoneKeys(identity(makeNone()))).to.eql(maskNoneKeys(makeNone()))
        })
    })

    describe('preserves composition', () => {
        it('for just values', () => {
            const f: (x: number) => number = x => x + 1
            const g: (x: number) => number = x => x + x
            const composite1: unknown = maskJustKeys(makeJust(42).fmap(f).fmap(g))
            const composite2: unknown = maskJustKeys(makeJust(42).fmap((x: number) => g(f(x))))

            expect(composite1).eql(composite2)
        })
        it('for none values', () => {
            const f: (x: number) => number = x => x + 1
            const g: (x: number) => number = x => x + x
            const composite1: unknown = maskNoneKeys(makeNone().fmap(f).fmap(g))
            const composite2: unknown = maskNoneKeys(makeNone().fmap((x: number) => g(f(x))))

            expect(composite1).eql(composite2)
        })
    })
})
