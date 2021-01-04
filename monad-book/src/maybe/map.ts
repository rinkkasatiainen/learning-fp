import {Just, matcherMaybe, Maybe} from '../maybe'
import {just} from './just'
import {none} from './none'

export const map: <A, B>(f: (a: A) => B) => (m: Maybe<A>) => Maybe<B> =
    <A, B>(f: (a: A) => B) => (m: Maybe<A>) => matcherMaybe<A, Maybe<B>>({
        none,
        some: (val: Just<A>) => just(f(val._value)),
    })(m)
