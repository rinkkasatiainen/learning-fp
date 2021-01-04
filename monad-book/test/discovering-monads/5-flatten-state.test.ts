import {expect} from 'chai'
import {next, pure, State, Tuple} from '../../src/state'
import {identity} from '../../src/maybe/identity'

describe('Two for the Price of One', () => {

    describe('can flatten state', () => {
        const flatten: <A, S>(ss: State<State<A, S>, S>) => State<A, S> =
            <A, S>(ss: State<State<A, S>, S>) => next<State<A,S>, A, S>(ss)(identity)

        it('works', () => {
            const s1: State<string, number> = (i) => ['any', i]
            const ss: State<State<string, number>, number> = (i) => [s1, i]

            const flattened = flatten(ss)

            const expected: Tuple<string, number> = ['any', 1]
            expect(ss(34)[0](1)).to.eql(expected)
            expect(flattened(1)).to.eql(expected)
        })
    })

})
