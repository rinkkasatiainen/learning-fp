import {expect} from 'chai'
import {next, NextFunction, pure, State, Tuple} from '../../src/state'
import {identity} from '../../src/maybe/identity'

describe('Two for the Price of One', () => {

    describe('State', () => {

        it('can call next', () => {
            const keys = ['first', 'second', 'third']

            const s: State<{ key: string }, number> = pure({key: 'start'})
            const f: NextFunction<{ key: string }, { key: string }, number> =
                state => i => [{key: `${state.key}-${keys[i]}`}, ++i]

            expect(s(0)).to.eql([{key: 'start'}, 0])
            expect(next(s)(f)(0)).to.eql([{key: 'start-first'}, 1])
            const ss = next<{key: string}, {key: string}, number>(s)(f)
            expect(next(ss)(f)(0)).to.eql([{key: 'start-first-second'}, 2])

            const sss = next<{key: string}, {key: string}, number>(ss)(f)
            expect(next(sss)(f)(0)).to.eql([{key: 'start-first-second-third'}, 3])
        })
    })

    describe('can flatten state', () => {
        const flatten: <A, S>(ss: State<State<A, S>, S>) => State<A, S> =
            <A, S>(ss: State<State<A, S>, S>) => next<State<A, S>, A, S>(ss)(identity)

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
