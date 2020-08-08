import { expect } from 'chai';
import {
	Leaf,
	matcher,
	Node,
	relabelTree,
	relabelTreeHO, relabelTreeWithText,
	stringifyTree,
	Tree,
} from '../src/tree';
import { Tuple } from '../src/state';

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

	describe('can relabel', () => {
		const stringifyRelabel = <A, B>(tree: Tree<Tuple<A, B>>): string => {
			return matcher<Tuple<A, B>, string>({
				leaf: (l: Leaf<Tuple<A, B>>) => {
					return `${ l.value[1] }:${ l.value[0] }`
				},
				node: (n: Node<Tuple<A, B>>) => {
					return stringifyRelabel<A, B>(n.l) + '-' + stringifyRelabel<A, B>(n.r)
				}
			})(tree)
		};

		it('can relabel leaf', () => {
			const tree = createLeaf('w')
			expect(relabelTree(tree)(1)[0]).to.eql({ _type: 'leaf', value: ['w', 1] })
		})

		it('can relabel small tree', () => {
			const l1 = createLeaf('a')
			const l2 = createLeaf('b')
			const tree = createNode(l1, l2)

			expect(relabelTree(tree)(1)[0]).to.eql({
				_type: 'node',
				l: { _type: 'leaf', value: ['a', 1] },
				r: { _type: 'leaf', value: ['b', 2] }
			})
		})

		it('can relabel a tree falling to rigth', () => {
			const l1 = createLeaf('a')
			const l2 = createLeaf('b')
			const l3 = createLeaf('c')
			const tree = createNode(l1, createNode(l2, l3))

			expect(relabelTree(tree)(1)[0]).to.eql({
				_type: 'node',
				l: { _type: 'leaf', value: ['a', 1] },
				r: {
					_type: 'node',
					l: { _type: 'leaf', value: ['b', 2] },
					r: { _type: 'leaf', value: ['c', 3] }
				}
			})
		})

		it('can relabel a  well balanced tree', () => {
			const l1 = createLeaf('a')
			const l2 = createLeaf('b')
			const l3 = createLeaf('c')
			const tree = createNode(createNode(l1, l1), createNode(l2, l3))

			expect(relabelTree(tree)(1)[0]).to.eql({
				_type: 'node',
				l: {
					_type: 'node',
					l: { _type: 'leaf', value: ['a', 1] },
					r: { _type: 'leaf', value: ['a', 2] }
				},
				r: {
					_type: 'node',
					l: { _type: 'leaf', value: ['b', 3] },
					r: { _type: 'leaf', value: ['c', 4] }
				}
			})

			// expect(stringifyRelabel(relabelTree<string>(tree)(1)[0])).to.eql('1:a-2:a-3:b-4:c')
		})

		it('can stringify a leaf', () => {
			const tree = createLeaf('a')

			const [relabelled] = relabelTree<string>(tree)(1);

			expect(stringifyRelabel(relabelled)).to.eql('1:a')
		})
		it('can stringify a small tree', () => {
			const l = createLeaf('a')
			const r = createLeaf('b')
			const tree = createNode(l, r)

			const [relabelled] = relabelTree<string>(tree)(1);
			expect(stringifyRelabel(relabelled)).to.eql('1:a-2:b')
		})
		it('can relabel a ', () => {
			const l1 = createLeaf('a')
			const l2 = createLeaf('b')
			const l3 = createLeaf('c')
			const l4 = createLeaf('d')
			const l5 = createLeaf('f')
			const tree = createNode(createNode(l1, createNode(l2, l3)), createNode(l4, l5))

			const [relabelled] = relabelTreeHO<string>(tree)(1);
			expect(stringifyRelabel(relabelled)).to.eql('1:a-2:b-3:c-4:d-5:f')
			// const [relabelledText] = relabelTreeWithText<string, string>(x => x+"a")(tree)('_');
			const [relabelledText] = relabelTreeWithText<string, string>(x => x+"foo")(createLeaf("a"))('_');
			expect(stringifyRelabel(relabelledText)).to.eql('_:a')
		})
		it('relabel with a whole state!', () => {
			const l1 = createLeaf(1)
			const l2 = createLeaf(2)
			// const l3 = createLeaf('c')
			// const l4 = createLeaf('d')
			// const l5 = createLeaf('f')
			const tree = createNode(l1, l2)

			const [relabelledText] = relabelTreeWithText<number, string>(x => x+"+")(tree)('_');
			expect(stringifyRelabel(relabelledText)).to.eql('_:1-_+:2')
		})
	})
});