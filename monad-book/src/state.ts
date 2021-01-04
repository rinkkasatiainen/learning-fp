export type Tuple<A, B> = [A, B]
export type State<A, S> = (x: S) => Tuple<A, S>

export const pure = <A, S>(x: A): State<A, S> => i => [x, i]

export const next: <A, B, S>(s: State<A, S>) => (g: (a: A) => State<B, S>) => State<B, S> =
    <A, B, S>(f: State<A, S>) => (g: (a: A) => State<B, S>) => (originalCounter: S) => {
        const [ss, nextCounter]: Tuple<A, S> = f(originalCounter)
        return g(ss)(nextCounter)
    }
