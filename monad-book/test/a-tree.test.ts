import { expect } from 'chai';

interface NodeType<T> {
	_type: T
}

interface Leaf<T> extends NodeType<'leaf'> {
	value: T
}

interface Node<T> extends NodeType<'node'> {
	l: Tree<T>
	r: Tree<T>
}

type Tree<T> = Leaf<T> | Node<T>

type TreeType<T> = Tree<T>['_type']
type TreeMap<U, T> = {
	[K in TreeType<T>]: U extends { _type: K } ? U : never
}
type TreeTypeMap<T> = TreeMap<Tree<T>, T>

type Pattern<T, U> = {
	[K in keyof TreeTypeMap<U>]: (shape: TreeTypeMap<any>[K]) => T
}

const matcher: <T, U>(pattern: Pattern<T, U>) => (tree: Tree<U>) => T =
	pattern => tree => pattern[tree._type](tree as any)

const stringifyTree = <T>(tree: Tree<T>): string => {
	return matcher<string, T>({
		leaf: l => l.value.toString(),
		node: n => stringifyTree(n.l) + ', ' + stringifyTree(n.r)
	})(tree)
};

const createLeaf = <T>(value: T): Leaf<T> => ({ _type: 'leaf', value: value });
const createNode = <T>(l: Tree<T>, r: Tree<T>): Node<T> => ({ _type: 'node', l, r });

describe('a Tree', () => {

	it('can constitute of a Leaf', () => {
		const tree: Tree<number> = createLeaf(1)

		expect(tree).to.eql({ _type: 'leaf', value: 1 })
	})

	describe('can be stringified', () => {
		const tree: Tree<number> = createLeaf(1)

		expect(stringifyTree(tree)).to.eql('1')
	});

	describe('tree of one node and 2 leafs', () => {

		let tree: Tree<number>
		beforeEach(() => {
			const l: Leaf<number> = createLeaf(1)
			const r: Leaf<number> = createLeaf(2)
			tree = { _type: 'node', l, r }
		})

		it('should have 2 leafs', () => {
			expect(tree).to.eql({ _type: 'node', l: { _type: 'leaf', value: 1 }, r: { _type: 'leaf', value: 2 } })
		})

		it('should be printable', () => {
			expect(stringifyTree(tree)).to.eql('1, 2')
		})
	});

	describe('a bigger three', () => {
		const l1 = createLeaf('a')
		const l2 = createLeaf('b')
		const l3 = createLeaf('c')
		const tree = createNode(l1, createNode(l2, l3))

		it('should be printable', () => {
			expect(stringifyTree(tree)).to.eql('a, b, c')
		})
	})

	interface Tuple<T> {
		value: T
		index: number
	}

	type Relabel<T> = (x: number) => Tuple<Tree<Tuple<T>>>

	function relabel<T>(tree: Tree<T>): Relabel<T> {
		return i => matcher<Tuple<Tree<Tuple<T>>>, T>({
			leaf: l => ({ value: { _type: 'leaf', value: { value: l.value, index: i } }, index: i }),
			node: n => {
				const { value: l, index: i1 } = relabel(n.l)(i)
				const { value: r, index: i2 } = relabel(n.r)(i1 + 1)
				return { value: { _type: 'node', l, r }, index: i2 };
			}
		})(tree)
	}


	describe('can relabel', () => {

		function stringifyRelabel<T>(tuple: Tree<Tuple<T>>): string {
			return matcher<string, Tuple<T>>({
				leaf: (l: Leaf<Tuple<T>>) => {
					return `${ l.value.index }:${l.value.value}`
				},
				node: (n: Node<Tuple<T>>) => {
					return stringifyRelabel(n.l) + '-' + stringifyRelabel(n.r)
				}
			})(tuple)
		}

		it('can relabel leaf', () => {
			const tree = createLeaf('w')
			expect(relabel(tree)(1).value).to.eql({ _type: 'leaf', value: { value: 'w', index: 1 } })
		})

		it('can relabel small tree', () => {
			const l1 = createLeaf('a')
			const l2 = createLeaf('b')
			const tree = createNode(l1, l2)

			expect(relabel(tree)(1).value).to.eql({
				_type: 'node',
				l: { _type: 'leaf', value: { value: 'a', index: 1 } },
				r: { _type: 'leaf', value: { value: 'b', index: 2 } }
			})
		})

		it('can relabel a tree falling to rigth', () => {
			const l1 = createLeaf('a')
			const l2 = createLeaf('b')
			const l3 = createLeaf('c')
			const tree = createNode(l1, createNode(l2, l3))

			expect(relabel(tree)(1).value).to.eql({
				_type: 'node',
				l: { _type: 'leaf', value: { value: 'a', index: 1 } },
				r: {
					_type: 'node',
					l: { _type: 'leaf', value: { value: 'b', index: 2 } },
					r: { _type: 'leaf', value: { value: 'c', index: 3 } }
				}
			})
		})

		it('can relabel a  well balanced tree', () => {
			const l1 = createLeaf('a')
			const l2 = createLeaf('b')
			const l3 = createLeaf('c')
			const tree = createNode(createNode(l1, l1), createNode(l2, l3))

			expect(relabel(tree)(1).value).to.eql({
				_type: 'node',
				l: {
					_type: 'node',
					l: { _type: 'leaf', value: { value: 'a', index: 1 } },
					r: { _type: 'leaf', value: { value: 'a', index: 2 } }
				},
				r: {
					_type: 'node',
					l: { _type: 'leaf', value: { value: 'b', index: 3 } },
					r: { _type: 'leaf', value: { value: 'c', index: 4 } }
				}
			})

			expect(stringifyRelabel(relabel<string>(tree)(1).value)).to.eql('1:a-2:a-3:b-4:c')
		})

		it('can relabel a ', () => {
			const l1 = createLeaf('a')
			const l2 = createLeaf('b')
			const l3 = createLeaf('c')
			const tree = createNode(createNode(l1, createNode(l2, l1)), createNode(l2, l3))

			expect(stringifyRelabel(relabel<string>(tree)(1).value)).to.eql('1:a-2:b-3:a-4:b-5:c')
		})
	})
});