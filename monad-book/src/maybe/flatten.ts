import {Maybe} from '../maybe'
import {then} from './then'
import {identity} from './identity'

export const flatten: <A>(m: Maybe<Maybe<A>>) => Maybe<A> =
    <A>(m: Maybe<Maybe<A>>) => then<Maybe<A>, A>(m)(identity)
