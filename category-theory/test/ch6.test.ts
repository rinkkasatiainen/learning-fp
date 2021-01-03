import {expect} from 'chai'
import {maybe, none, Some, just, toEither} from '../src/maybe'
import {either, Either, left, right, toMaybe} from '../src/either'
import {checkExhaustive} from '../src/check-exhaustiv'

describe('Simple Algebraic Data Types - https://bartoszmilewski.com/2015/01/13/simple-algebraic-data-types/', () => {
    describe('1 - isomorphism between \'Maybe a\' and \'Either () a\'', () => {

        interface Any {
            any: string;
        }

        const anything: Any = {any: 'thing'}
        const maybeA = just(anything)
        const nothing = none()
        const rightA = right(anything)
        const leftA = left(undefined)

        expect(maybe<Any, Either<never, Any>>(right)(maybeA)).to.eql(rightA)
        expect(either<never, Any, Some<Any>>(() => {
            throw Error('Never!')
        })(just)(rightA)).to.eql(maybeA)

        expect(toEither(() => left(undefined))(right)(nothing)).to.eql(leftA)
        expect(toMaybe(just)(leftA)).to.eql(nothing)
    })

    describe('2 - Shape', () => {
        interface ST<T> {
            _shapeType: T;
        }

        interface Circle extends ST <'Circle'> {
            r: number;
        }

        interface Rect extends ST<'Rect'> {
            d: number;
            h: number;
        }

        type Shape = Circle | Rect
        // https://medium.com/@fillopeter/pattern-matching-with-typescript-done-right-94049ddd671c
        type ShapeType = Shape['_shapeType']
        type ShapeMap<U> = {
            [K in ShapeType]: U extends { _shapeType: K } ? U : never
        }
        type ShapeTypeMap = ShapeMap<Shape>

        type Pattern<T> = {
            [K in keyof ShapeTypeMap]: (shape: ShapeTypeMap[K]) => T
        }

        const matcher: <T>(pattern: Pattern<T>) => (shape: Shape) => T =
            pattern => shape => pattern[shape._shapeType](shape as any)

        const circle: (r: number) => Circle = r => ({r, _shapeType: 'Circle'})
        const rect: (d: number, h: number) => Rect = (d, h) => ({d, h, _shapeType: 'Rect'})

        const area: (x: Shape) => number =
            shape => {
                switch (shape._shapeType) {
                    case 'Circle':
                        return Math.PI * shape.r * shape.r
                    case 'Rect':
                        return shape.d * shape.h
                    default:
                        return checkExhaustive(shape)
                }
            }
        const circ: (x: Shape) => number = matcher<number>({
            Circle: c => c.r * c.r * Math.PI,
            Rect: r => 2 * r.h * r.d,
        })

        describe('2 - Shape in FP', () => {
            it(' has area', () => {
                expect(Math.floor(area(circle(1)))).to.eql(3)
                expect(area(rect(2, 4))).to.eql(8)
            })

            it('has circ, in pattern matching!', () => {
                expect(Math.floor(circ(circle(23)))).to.eql(1661)
                expect(circ(rect(4, 2))).to.eql(16)
            })
        })

        describe('2 & 3 - shape in OO', () => {
            interface OOShape {
                area: () => number;
                circ: () => number;
            }

            class OOCircle implements OOShape {
                private r: number;

                constructor(r: number) {
                    this.r = r
                }

                area(): number {
                    return Math.PI * this.r * this.r
                }

                circ(): number {
                    return 2 * Math.PI * this.r
                }
            }

            class OORect implements OOShape {
                private _d: number;
                private _h: number;

                constructor(d: number, h: number) {
                    this._d = d
                    this._h = h
                }

                area(): number {
                    return this._d * this._h
                }

                circ(): number {
                    return 2 * this._d * this._h
                }
            }

            it('has area', () => {
                expect(new OOCircle(2).area()).to.eql(area(circle(2)))
                expect(Math.floor(new OOCircle(2).area())).to.eql(12)

                expect(new OORect(3, 5).area()).to.eql(area(rect(5, 3)))
            })

            it('has circ', () => {
                expect(new OOCircle(2).circ()).to.eql(circ(circle(2)))
                expect(Math.floor(new OOCircle(2).circ())).to.eql(12)

                expect(Math.floor(new OORect(2, 4).circ())).to.eql(16)
            })

        })
    })

})

