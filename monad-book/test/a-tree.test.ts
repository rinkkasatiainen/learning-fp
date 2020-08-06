import { expect } from 'chai';
import JSON = Mocha.reporters.JSON;

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
	pattern => tree => {
		console.log(pattern, tree)

		return pattern[tree._type](tree as any);
	}

function stringifyTree<T>(tree: Tree<T>): string {
	console.log(tree)
	return matcher<string, T>({
		leaf: l => l.value.toString(),
		node: n => stringifyTree(n.l) + ', ' + stringifyTree(n.r)
	})(tree)
}

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

});