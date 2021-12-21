import {Bifunctor} from './bifunctor'


type EitherType = 'right' | 'left'
interface EitherBase<T extends EitherType> {
    eitherType: T;
}

export interface Left<A> extends Bifunctor<A, never>, EitherBase<'left'> {
}

export interface Right<B> extends Bifunctor<never, B>, EitherBase<'right'> {
}

export type Either<A, B> = Left<A> | Right<B>
