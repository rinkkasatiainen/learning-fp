import {Functor} from './functor'

type MaybeType = 'none' | 'just'

interface MaybeBase<T extends MaybeType> {
    maybeType: T;
}

export interface None extends Functor<unknown>, MaybeBase<'none'> {
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


type MaybeMatcherMap<A, B> = {
    [K in MaybeType]: A extends { maybeType: K } ? A : never
}
type MaybeTypeMap<A> = MaybeMatcherMap<Maybe<A>, A>
type Pattern<A, B> = {
    // 'none': () => Nothing;
    // 'some': (x: Just<A>) => B;
    [K in MaybeType]: (shape: MaybeTypeMap<A>[K]) => B;
}
export const matchMaybe: <A, B>(pattern: Pattern<A, B>) => (maybe: Maybe<A>) => B =
    pattern => m => pattern[m.maybeType](m as unknown as never)

