import {expect} from 'chai'
import {Either, makeLeft, makeRight} from '../src/either'
import {identity} from '../src/identity'
import {verifyKeys} from './verify-keys'

const verifyEitherKeys = verifyKeys<Either<unknown, unknown>>(['value', 'eitherType'])

const notCalled = () => {
    throw new Error('should not have been called')
}

describe('Either', () => {
    describe('functor laws', () => {
        describe('preserves identity', () => {
            it('for Left', () => {
                const left = makeLeft('leftString')
                expect(verifyEitherKeys(identity(left))).to.eql(verifyEitherKeys(makeLeft('leftString')))
                // identity of bimap
                const identityAfterBimap = left.bimap(identity)(notCalled)
                expect(verifyEitherKeys(identityAfterBimap)).to.eql(verifyEitherKeys(makeLeft('leftString')))
            })
            it('for Right', () => {
                // basic identity
                const right = makeRight(3)
                expect(verifyEitherKeys(identity(right))).to.eql(verifyEitherKeys(makeRight(3)))
                // identity of bimap
                expect(verifyEitherKeys(right.bimap(notCalled)(identity))).to.eql(verifyEitherKeys(makeRight(3)))
            })
        })
        describe('preserves composition', () => {
            it('for Left', () => {
                const value = 'leftString'
                const f: (x: string) => string = str => `Of ${str}`
                const g: (x: string) => string = str => str.slice(1, 10)
                const eitherOfcomposition = makeLeft(g(f(value)))
                expect(verifyEitherKeys(eitherOfcomposition)).to.eql(verifyEitherKeys(makeLeft('f leftStr')))

                // composition of bimap
                const compositionOfEither = makeLeft(value).bimap(f)(notCalled).bimap(g)(notCalled)
                expect(verifyEitherKeys(eitherOfcomposition)).to.eql(verifyEitherKeys(compositionOfEither))
            })
            it('for Right', () => {
                interface Tmp {x: number}
                const value: Tmp = {x: 5}

                const f: (x: Tmp) => Tmp = val => ({x: val.x**2})
                const g: (x: Tmp) => Tmp = val =>({x: val.x - 6})
                const eitherOfcomposition = makeRight(g(f(value)))
                expect(verifyEitherKeys(eitherOfcomposition)).to.eql(verifyEitherKeys(makeRight({x: 19})))

                // composition of bimap
                const compositionOfEither = makeRight(value).bimap(notCalled)(f).bimap(notCalled)(g)
                expect(verifyEitherKeys(eitherOfcomposition)).to.eql(verifyEitherKeys(compositionOfEither))
            })
        })
    })
})
