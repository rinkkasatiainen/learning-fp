import {Bifunctor} from './bifunctor'


type EitherType = 'right' | 'left'

interface EitherBase<T extends EitherType, V> {
    eitherType: T;
    value: V;
}

export interface Left<A> extends Bifunctor<A, never>, EitherBase<'left', A> {
    bimap: <C, D>(f: (a: A) => C) => (g: (b: never) => D) => Left<C>;
}

export interface Right<B> extends Bifunctor<never, B>, EitherBase<'right', B> {
    bimap: <C, D>(f: (a: never) => C) => (g: (b: B) => D) => Right<D>;
}

export type Either<A, B> = Left<A> | Right<B>

export const makeRight: <B>(value: B) => Right<B> = <B>(value: B) => ({
    bimap: <C, D>() => (g: (b: B) => D) => makeRight(g(value)),
    eitherType: 'right',
    value,
})
export const makeLeft: <A>(value: A) => Left<A> = <A>(value: A) => ({
    bimap: <C, D>(f: (a: A) => C) => () => makeLeft(f(value)),
    eitherType: 'left',
    value,
})
