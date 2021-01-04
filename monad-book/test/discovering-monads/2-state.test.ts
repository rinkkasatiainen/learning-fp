import {expect} from 'chai'
import {Leaf, Node, relabelTree, relabelTreeHO, relabelTreeHOV2, relabelTreeWithText} from '../../src/tree'
import {createLeaf, createNode, stringifyRelabel} from './tree-helpers'


describe('State', () => {
    const incNumber = (x: number) => x + 1
    const doubleText = (x: string) => `${x}${x}`

    describe('A tree of a leaf', () => {
        let tree: Leaf<string>
        let numberTree: Leaf<number>

        beforeEach(() => {
            tree = createLeaf('Foo')
            numberTree = createLeaf(1)
        })

        it('2.1 can relabel with increment withCounter', () => {
            const [relabelled] = relabelTree<string>(tree)(1)

            expect(stringifyRelabel(relabelled)).to.eql('1:Foo')
        })

        it('2.2 can relabel with increment number', () => {
            const [relabelledText] = relabelTreeWithText<string, number>(incNumber)(tree)(0)
            expect(stringifyRelabel(relabelledText)).to.eql('0:Foo')
        })

        it('2.2 can relabel with state', () => {
            const [relabelledText] = relabelTreeWithText<number, string>(doubleText)(numberTree)('?')
            expect(stringifyRelabel(relabelledText)).to.eql('?:1')
        })
    })

    describe('A tree of two leafs', () => {
        let l: Leaf<string>
        let r: Leaf<string>
        let tree: Node<string>
        let numberTree: Node<number>

        beforeEach(() => {
            l = createLeaf('Foo')
            r = createLeaf('Bar')
            tree = createNode(l, r)
            numberTree = createNode(createLeaf(1), createLeaf(2))
        })

        it('2.1 can relabel with increment withCounter', () => {
            const [relabelled] = relabelTree<string>(tree)(1)

            expect(stringifyRelabel(relabelled)).to.eql('1:Foo-2:Bar')
        })

        it('2.2 can relabel with increment number', () => {
            const [relabelledText] = relabelTreeWithText<string, number>(incNumber)(tree)(0)
            expect(stringifyRelabel(relabelledText)).to.eql('0:Foo-1:Bar')
        })

        it('2.2 can relabel with state', () => {
            const [relabelledText] = relabelTreeWithText<number, string>(doubleText)(numberTree)('?')
            expect(stringifyRelabel(relabelledText)).to.eql('?:1-??:2')
        })
    })

    describe('bigger tree', () => {
        let n1: Leaf<number>
        let n2: Leaf<number>
        let l1: Leaf<string>
        let l2: Leaf<string>
        let l3: Leaf<string>
        let l4: Leaf<string>
        let l5: Leaf<string>

        beforeEach(() => {
            n1 = createLeaf(1)
            n2 = createLeaf(2)

            l1 = createLeaf('a')
            l2 = createLeaf('b')
            l3 = createLeaf('c')
            l4 = createLeaf('d')
            l5 = createLeaf('f')
        })


        it('relabel with a whole state!', () => {
            const tree = createNode(n1, n2)

            const [relabelledText] = relabelTreeWithText<number, string>(x => x + '+')(tree)('_')
            expect(stringifyRelabel(relabelledText)).to.eql('_:1-_+:2')
        })

        describe('on Higher order function', () => {

            it('can relabel a Tree', () => {
                const tree = createNode(createNode(l1, createNode(l2, l3)), createNode(l4, l5))

                const [relabelled] = relabelTreeHO<string>(tree)(1)
                expect(stringifyRelabel(relabelled)).to.eql('1:a-2:b-3:c-4:d-5:f')
            })

            it('can relabel a Tree V2', () => {
                const tree = createNode(createNode(l1, createNode(l2, l3)), createNode(l4, l5))

                const [relabelled] = relabelTreeHOV2<string>(tree)(1)
                expect(stringifyRelabel(relabelled)).to.eql('1:a-2:b-3:c-4:d-5:f')
            })

            it('can relabel a TreeWithText', () => {
                const [relabelledText] = relabelTreeWithText<string, string>(x => x + '*')(
                    createNode(createLeaf('a'), createNode(createLeaf('b'), createLeaf('c'))))('inc')
                expect(stringifyRelabel(relabelledText)).to.eql('inc:a-inc*:b-inc**:c')
            })
        })
    })

})
