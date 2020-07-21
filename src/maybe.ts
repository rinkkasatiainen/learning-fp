import { Either, Left, Right } from './either';

interface Optional<T> {
	isValid: T
}

export type None = Optional<false>

export interface Some<T> extends Optional <true> {
	value: T
}

export type Maybe<T> = None | Some<T>

export const none: () => None = () => ({ isValid: false })
export const some: <A>(value: A) => Some<A> = value => ({ isValid: true, value })

export const id: <A>(value: Maybe<A>) => Maybe<A> =
	value => value

export const toEither: <A, B>(onNone: () => Left<A>) => (onSome: (y: B) => Right<B>) => (maybe: Maybe<B>) => Either<A, B> =
	onNone => onSome => _maybe => {
		if(_maybe.isValid)
			return onSome(_maybe.value)
		return onNone()
	}

export const maybe: <A, B>(onMaybe: (x: A) => B) => (value: Maybe<A>) => B | never =
	onMaybe => _maybe => {
		if (_maybe.isValid) {
			return onMaybe(_maybe.value)
		}
		throw Error('cannot execute maybe on \'Nothing\'')
	}