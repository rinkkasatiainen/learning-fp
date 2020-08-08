import { next, pure, State, Tuple} from './state';
import { Counter, nextCounter, WithCounter } from './with-counter';

interface NodeType<T> {
	_type: T
}

export interface Leaf<T> extends NodeType<'leaf'> {
	value: T
}

export interface Node<T> extends NodeType<'node'> {
	l: Tree<T>
	r: Tree<T>
}

export type Tree<A> = Leaf<A> | Node<A>
type TreeType<A> = Tree<A>['_type']
type TreeMap<A, B> = {
	[K in TreeType<B>]: A extends { _type: K } ? A : never
}
type TreeTypeMap<A> = TreeMap<Tree<A>, A>
type Pattern<A, B> = {
	[K in keyof TreeTypeMap<A>]: (shape: TreeTypeMap<any>[K]) => B
}

export const matcher: <A, B>(pattern: Pattern<A, B>) => (tree: Tree<A>) => B =
	pattern => tree => pattern[tree._type](tree as any)

export const stringifyTree = <A>(tree: Tree<A>): string => {
	return matcher<A, string>({
		leaf: l => l.value.toString(),
		node: n => stringifyTree<A>(n.l) + ', ' + stringifyTree<A>(n.r)
	})(tree)
};

type Relabel<T> = WithCounter<Tree<Counter<T>>>

export function relabelTree<A>(tree: Tree<A>): Relabel<A> {
	return i => matcher<A, Counter<Tree<Counter<A>>>>({
		leaf: l => {
			// console.log({v: l.value, i})
			return [{ _type: 'leaf', value: [l.value, i] }, i + 1];
		},
		node: n => {
			// console.log(n, i)
			const [l, i1] = relabelTree<A>(n.l)(i)
			const [r, i2] = relabelTree<A>(n.r)(i1)
			// console.log(r, i2)
			return [{ _type: 'node', l, r }, i2]
		}
	})(tree)
}

function nextTree<A>(x: WithCounter<Tree<Counter<A>>>) {
	return nextCounter<Tree<Counter<A>>, Tree<Counter<A>>>(x)
}

export const relabelTreeHO = <A>(tree: Tree<A>): WithCounter<Tree<Counter<A>>> => matcher<A, Relabel<A>>({
	leaf: l => i => [{ _type: 'leaf', value: [l.value, i] }, i + 1],
	node: n =>
		nextTree<A>(relabelTreeHO<A>(n.l))(ll =>
			nextTree<A>(relabelTreeHO<A>(n.r))(rr =>
				pure({ _type: 'node', l: ll, r: rr })))
})(tree);

export const relabelTreeWithText: <A, B>(inc: (x: B) => B) => (tree: Tree<A>) => State<Tree<Tuple<A,B>>, B>
	= <A, B>(inc: (x: B)=>B) => ( tree: Tree<A>) => {
	const recurse = relabelTreeWithText<A, B>(inc);

	return matcher<A, State<Tree<Tuple<A,B>>, B>>({
		leaf: l => i => {
			return [{ _type: 'leaf', value: [l.value, i] }, inc(i)];
		},
		node: n =>
			next(recurse(n.l))(l =>
				next(recurse(n.r))(r =>
					pure({ _type: 'node', l, r})))
	})(tree);
};
