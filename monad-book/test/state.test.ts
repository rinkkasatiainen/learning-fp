import { expect } from 'chai';
import { createLeaf, createNode, stringifyRelabel } from './tree-helpers';
import { relabelTree, relabelTreeHO, relabelTreeWithText } from '../src/tree';


describe('State', () => {
	const incNumber = (x: number) => x+1
	const doubleText = (x: string) => `${x}${x}`

	describe('A tree of a leaf', () => {
		const tree = createLeaf('Foo')
		const numberTree = createLeaf(1)

		it('2.1 can relabel with increment withCounter', () => {
			const [relabelled] = relabelTree<string>(tree)(1);

			expect(stringifyRelabel(relabelled)).to.eql('1:Foo')
		})

		it('2.2 can relabel with increment number', () => {
			const [relabelledText] = relabelTreeWithText<string, number>(incNumber)(tree)(0);
			expect(stringifyRelabel(relabelledText)).to.eql('0:Foo')
		})

		it('2.2 can relabel with state', () => {
			const [relabelledText] = relabelTreeWithText<number, string>(doubleText)(numberTree)("?");
			expect(stringifyRelabel(relabelledText)).to.eql('?:1')
		})
	});

	describe('A tree of two leafs', () => {
		const l = createLeaf('Foo');
		const r = createLeaf('Bar');
		const tree = createNode(l, r)
		const numberTree = createNode(createLeaf(1), createLeaf(2))

		it('2.1 can relabel with increment withCounter', () => {
			const [relabelled] = relabelTree<string>(tree)(1);

			expect(stringifyRelabel(relabelled)).to.eql('1:Foo-2:Bar')
		})

		it('2.2 can relabel with increment number', () => {
			const [relabelledText] = relabelTreeWithText<string, number>(incNumber)(tree)(0);
			expect(stringifyRelabel(relabelledText)).to.eql('0:Foo-1:Bar')
		})

		it('2.2 can relabel with state', () => {
			const [relabelledText] = relabelTreeWithText<number, string>(doubleText)(numberTree)("?");
			expect(stringifyRelabel(relabelledText)).to.eql('?:1-??:2')
		})
	});

	describe('bigger tree', () => {
		const n1 = createLeaf(1)
		const n2 = createLeaf(2)

		const l1 = createLeaf('a')
		const l2 = createLeaf('b')
		const l3 = createLeaf('c')
		const l4 = createLeaf('d')
		const l5 = createLeaf('f')

		it('relabel with a whole state!', () => {
			const tree = createNode(n1, n2)

			const [relabelledText] = relabelTreeWithText<number, string>(x => x+"+")(tree)('_');
			expect(stringifyRelabel(relabelledText)).to.eql('_:1-_+:2')
		})

		it('can relabel a with HigherOrder (withCounter)', () => {
			const tree = createNode(createNode(l1, createNode(l2, l3)), createNode(l4, l5))

			const [relabelled] = relabelTreeHO<string>(tree)(1);
			expect(stringifyRelabel(relabelled)).to.eql('1:a-2:b-3:c-4:d-5:f')
			// const [relabelledText] = relabelTreeWithText<string, string>(x => x+"a")(tree)('_');
			const [relabelledText] = relabelTreeWithText<string, string>(x => x+"foo")(createLeaf("a"))('_');
			expect(stringifyRelabel(relabelledText)).to.eql('_:a')
		})
	});

});