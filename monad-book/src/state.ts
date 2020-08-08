type State<A,B> = [A, B]

type Tuple<A, B> = [A, B]
export type Counter<A> = Tuple<A, number>
export type WithCounter<T> = (x: number) => Counter<T>

export const pure = <T>(x: T): WithCounter<T> => i => [x, i];
export const next: <A, B>(x: WithCounter<A>) => (f: (f1: A) => WithCounter<B>) => WithCounter<B> =
	f => g => originalCounter => {
		const [a, newCounter] = f(originalCounter)
		return g(a)(newCounter)
	}