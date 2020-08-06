import { Maybe, none, just } from './maybe';

interface LR<A extends boolean, B extends boolean> {
	isLeft: A
	isRight: B
}

export interface Left<A> extends LR<true, false> {
	value: A
}

export interface Right<B> extends LR<false, true> {
	value: B
}

export type Either<A, B> = Left<A> | Right<B>

export const left: <A>(x: A) => Left<A> = value => ({ isLeft: true, isRight: false, value })
export const right: <A>(x: A) => Right<A> = value => ({ isRight: true, isLeft: false, value })

export const toMaybe: <A>(onRight: (x: A) => Maybe<A>) => (either: Either<any, A>) => Maybe<A> =
	<A>(onRight: (x: A) => Maybe<A>) => either<any, A, Maybe<A>>(none)(just)

export const either: <A, B, C>(onLeft: (a: A) => C) => (onRight: (b: B) => C) => (either: Either<A, B>) => C =
	onLeft => onRight => e => {
		if (e.isLeft) {
			return (onLeft(e.value))
		}
		return (onRight(e.value))
	}
