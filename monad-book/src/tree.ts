import {next, pure, State, Tuple} from './state'
import {Counter, nextCounter, WithCounter} from './with-counter'

interface NodeType<T> {
    _type: T;
}

export interface Leaf<T> extends NodeType<'leaf'> {
    value: T;
}

export interface Node<T> extends NodeType<'node'> {
    l: Tree<T>;
    r: Tree<T>;
}

export type Tree<A> = Leaf<A> | Node<A>
type TreeType<A> = Tree<A>['_type']
type TreeMap<A, B> = {
    [K in TreeType<B>]: A extends { _type: K } ? A : never
}
type TreeTypeMap<A> = TreeMap<Tree<A>, A>
type Pattern<A, B> = {
    [K in keyof TreeTypeMap<A>]: (shape: TreeTypeMap<A>[K]) => B
}

export const matcher: <A, B>(pattern: Pattern<A, B>) => (tree: Tree<A>) => B =
    // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-explicit-any
    pattern => tree => pattern[tree._type](tree as any)

export const stringifyTree = <A extends { toString: () => string }>(tree: Tree<A>): string => matcher<A, string>({
    leaf: l => l.value.toString(),
    node: n => stringifyTree<A>(n.l) + ', ' + stringifyTree<A>(n.r),
})(tree)

type Relabel<T> = WithCounter<Tree<Counter<T>>>

export function relabelTree<A>(tree: Tree<A>): Relabel<A> {
    return i => matcher<A, Counter<Tree<Counter<A>>>>({
        leaf: l => [{ _type: 'leaf', value: [l.value, i] }, i + 1],
        node: n => {
            const [l, i1] = relabelTree<A>(n.l)(i)
            const [r, i2] = relabelTree<A>(n.r)(i1)
            return [{ _type: 'node', l, r }, i2]
        },
    })(tree)
}

function nextTree<A>(x: WithCounter<Tree<Counter<A>>>) {
    return nextCounter<Tree<Counter<A>>, Tree<Counter<A>>>(x)
}

export const relabelTreeHO = <A>(tree: Tree<A>): WithCounter<Tree<Counter<A>>> => matcher<A, Relabel<A>>({
    leaf: l => i => [{_type: 'leaf', value: [l.value, i]}, i + 1],
    node: n =>
        nextTree<A>(relabelTreeHO<A>(n.l))(ll =>
            nextTree<A>(relabelTreeHO<A>(n.r))(rr =>
                pure({_type: 'node', l: ll, r: rr}))),
})(tree)

export const relabelTreeHOV2 = <A>(tree: Tree<A>): WithCounter<Tree<Counter<A>>> => matcher<A, Relabel<A>>({
    leaf: l => i => [{_type: 'leaf', value: [l.value, i]}, i + 1],
    node: n =>
        next(relabelTreeHOV2(n.l))(ll =>
            next(relabelTreeHOV2(n.r))(rr =>
                pure({_type: 'node', l: ll, r: rr}))),
})(tree)

export const relabelTreeWithText: <A, B>(inc: (x: B) => B) => (tree: Tree<A>) => State<Tree<Tuple<A, B>>, B>
    = <A, B>(inc: (x: B) => B) => (tree: Tree<A>) => {
        const recurse = relabelTreeWithText<A, B>(inc)

        return matcher<A, State<Tree<Tuple<A, B>>, B>>({
            leaf: l => i => [{_type: 'leaf', value: [l.value, i]}, inc(i)],
            node: n =>
                next(recurse(n.l))(l =>
                    next(recurse(n.r))(r =>
                        pure({_type: 'node', l, r}))),
        })(tree)
    }
