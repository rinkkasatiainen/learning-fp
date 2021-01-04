import {Just} from '../maybe'

export const just: <A>(a: A) => Just<A> = _value => ({_maybeType: 'some', _value})
