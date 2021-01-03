import { Leaf, matcher, Node, Tree } from '../src/tree'
import { Tuple } from '../src/state'

export const createLeaf = <T>(value: T): Leaf<T> => ({ _type: 'leaf', value })
export const createNode = <T>(l: Tree<T>, r: Tree<T>): Node<T> => ({ _type: 'node', l, r })

export const stringifyRelabel = <A, B>(tree: Tree<Tuple<A, B>>): string => matcher<Tuple<A, B>, string>({
    leaf: (l: Leaf<Tuple<A, B>>) => `${ l.value[1] }:${ l.value[0] }`,
    node: (n: Node<Tuple<A, B>>) => stringifyRelabel<A, B>(n.l) + '-' + stringifyRelabel<A, B>(n.r),
})(tree)
