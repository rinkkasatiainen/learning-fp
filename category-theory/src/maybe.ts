import {Functor} from './functor'

type MaybeType = 'none' | 'just'

interface MaybeBase<T extends MaybeType> {
    maybeType: T;
}

export interface None extends Functor<never>, MaybeBase<'none'> {
    fmap: <A, B>(f: (a: A) => B) => None;
}

export interface Just<A> extends Functor<A>, MaybeBase<'just'> {
    value: A;
    fmap: <B>(f: (a: A) => B) => Just<B>;
}

export type Maybe<A> = None | Just<A>

export const makeJust: <A>(val: A) => Just<A> = <A>(value: A) => ({
    maybeType: 'just',
    value,
    fmap: <B>(f: (a: A) => B) => makeJust(f(value)),
})

export const makeNone: () => None = () => ({
    maybeType: 'none',
    fmap: () => makeNone(),
})
