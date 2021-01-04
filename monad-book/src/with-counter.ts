import {State, Tuple} from './state'

export type Counter<A> = Tuple<A, number>

// WithCounter as a State
export type WithCounter<T> = State<T, number>
export const nextCounter: <A, B>(x: State<A, number>) => (f: (f1: A) => State<B, number>) => State<B, number> =
// export type WithCounter<T> = (x: number) => Counter<T>
// export const nextCounter: <A, B>(x: WithCounter<A>) => (f: (f1: A) => WithCounter<B>) => WithCounter<B> =
    f => g => originalCounter => {
        const [a, newCounter] = f(originalCounter)
        return g(a)(newCounter)
    }
