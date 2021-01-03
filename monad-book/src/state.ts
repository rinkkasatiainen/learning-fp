export type Tuple<A, B> = [A, B]
export type State<A, B> = (x: B) => Tuple<A, B>

export const pure = <A, B>(x: A): State<A, B> => i => [x, i]
export const next: <A, B>(x: State<A, B>) => (f: (f1: A) => State<A, B>) => State<A, B> =
    f => g => originalCounter => {
        const [a, newCounter] = f(originalCounter)
        return g(a)(newCounter)
    }
