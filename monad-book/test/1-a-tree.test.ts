import { expect } from 'chai'
import { Leaf, Node, relabelTree, stringifyTree, Tree } from '../src/tree'
import { createLeaf, createNode, stringifyRelabel } from './tree-helpers'

describe('a Tree', () => {

    it('can constitute of a Leaf', () => {
        const tree: Tree<number> = createLeaf(1)

        expect(tree).to.eql({ _type: 'leaf', value: 1 })
    })

    it('can be stringified', () => {
        const tree: Tree<number> = createLeaf(1)

        expect(stringifyTree(tree)).to.eql('1')
    })

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
    })

    describe('a bigger three', () => {
        let l1: Leaf<string>
        let l2: Leaf<string>
        let l3: Leaf<string>
        let tree: Node<string>

        beforeEach(() => {
            l1 = createLeaf('a')
            l2 = createLeaf('b')
            l3 = createLeaf('c')
            tree = createNode(l1, createNode(l2, l3))
        })

        it('should be printable', () => {
            expect(stringifyTree(tree)).to.eql('a, b, c')
        })

        it('should be printable towards left', () => {
            const leftTree = createNode(createNode(l2, l3), l1)
            expect(stringifyTree(leftTree)).to.eql('b, c, a')
        })
    })
    describe('can relabel', () => {

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
                r: { _type: 'leaf', value: ['b', 2] },
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
                    r: { _type: 'leaf', value: ['c', 3] },
                },
            })
        })

        it('can relabel a  well balanced tree', () => {
            const l1 = createLeaf('a')
            const l2 = createLeaf('b')
            const l3 = createLeaf('c')
            const tree = createNode(createNode(l1, l3), createNode(l2, l3))

            expect(relabelTree(tree)(1)[0]).to.eql({
                _type: 'node',
                l: {
                    _type: 'node',
                    l: { _type: 'leaf', value: ['a', 1] },
                    r: { _type: 'leaf', value: ['c', 2] },
                },
                r: {
                    _type: 'node',
                    l: { _type: 'leaf', value: ['b', 3] },
                    r: { _type: 'leaf', value: ['c', 4] },
                },
            })

            expect(stringifyRelabel(relabelTree<string>(tree)(11)[0])).to.eql('11:a-12:c-13:b-14:c')
        })

        it('can stringify a leaf', () => {
            const tree = createLeaf('a')

            const [relabelled] = relabelTree<string>(tree)(1)

            expect(stringifyRelabel(relabelled)).to.eql('1:a')
        })
        it('can stringify a small tree', () => {
            const l = createLeaf('a')
            const r = createLeaf('b')
            const tree = createNode(l, r)

            const [relabelled] = relabelTree<string>(tree)(1)
            expect(stringifyRelabel(relabelled)).to.eql('1:a-2:b')
        })
    })
})
