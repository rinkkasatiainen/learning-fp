import {matcherMaybe, Maybe} from '../maybe'
import {then} from './then'
import {identity} from './identity'
import {none} from './none'

export const flatten: <A>(m: Maybe<Maybe<A>>) => Maybe<A> =
    <A>(m: Maybe<Maybe<A>>) => then<Maybe<A>, A>(m)(identity)

export const flattenWithNoThen: <A>(m: Maybe<Maybe<A>>) => Maybe<A> =
    <A>(m: Maybe<Maybe<A>> ) => matcherMaybe({
        none,
        some: val => (val._value),
    })(m)
