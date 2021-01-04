import {Just, matcherMaybe, Maybe} from '../maybe'
import {none} from './none'

export const then: <A, B>(x: Maybe<A>) => (f: (a: A) => Maybe<B>) => Maybe<B> =
    <A>(m: Maybe<A>) => <B>(f: (a: A) => Maybe<B>) => matcherMaybe({
        none,
        some: (val: Just<A>) => f(val._value),
    })(m)
