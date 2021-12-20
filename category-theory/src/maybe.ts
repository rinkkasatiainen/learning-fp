import {Either, Left, Right} from './either'

export const fmap: <A, B>(f: (x: A) => B) => (m: Maybe<A>) => Maybe<B> =
    f => m => {
        if (m.isJust) {
            return just(f(get(m)))
        }
        return none()
    }

export interface IsValid<T> {
    isJust: T;
}

export type None = IsValid<false>

export interface Some<T> extends IsValid <true> {
    value: T;
}

export type Maybe<T> = None | Some<T>

export const none: () => None = () => ({isJust: false})
export const just: <A>(value: A) => Some<A> = value => ({isJust: true, value})

export const get: <A>(value: Maybe<A>) => A | never =
    value => {
        if (value.isJust) {
            return value.value
        }
        throw new Error('cannot get from Nothing')
    }

export const id: <A>(value: A) => A =
    value => value

export const toEither:
    <A, B>(onNone: () => Left<A>) => (onSome: (y: B) => Right<B>) => (maybe: Maybe<B>) => Either<A, B> =
    onNone => onSome => _maybe => {
        if (_maybe.isJust) {
            return onSome(_maybe.value)
        }
        return onNone()
    }

export const maybe: <A, B>(onMaybe: (x: A) => B) => (value: Maybe<A>) => B | never =
    onMaybe => _maybe => {
        if (_maybe.isJust) {
            return onMaybe(_maybe.value)
        }
        throw Error('cannot execute maybe on \'Nothing\'')
    }
