import {Maybe} from '../maybe'
import {flip} from './flip'
import {map} from './map'

export const fmap: <A, B>(f: (a: A) => Maybe<B>) => (m: Maybe<A>) => Maybe<Maybe<B>> =
    <A, B>(f: (a: A) => Maybe<B>) => (m: Maybe<A>) =>  flip<(a: A) => Maybe<B>, Maybe<A>, Maybe<Maybe<B>>>(map)(m)(f)
