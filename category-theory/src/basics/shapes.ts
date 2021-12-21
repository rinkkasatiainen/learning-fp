interface ST<T> {
    _shapeType: T;
}

export interface Circle extends ST <'Circle'> {
    r: number;
}

export interface Rect extends ST<'Rect'> {
    d: number;
    h: number;
}

export type Shape = Circle | Rect
// https://medium.com/@fillopeter/pattern-matching-with-typescript-done-right-94049ddd671c
type ShapeType = Shape['_shapeType']
type ShapeMap<U> = {
    [K in ShapeType]: U extends { _shapeType: K } ? U : never
}
type ShapeTypeMap = ShapeMap<Shape>

type Pattern<T> = {
    [K in keyof ShapeTypeMap]: (shape: ShapeTypeMap[K]) => T
}

export const circle: (r: number) => Circle = r => ({r, _shapeType: 'Circle'})
export const rect: (d: number, h: number) => Rect = (d, h) => ({d, h, _shapeType: 'Rect'})

const matcher: <T>(pattern: Pattern<T>) => (shape: Shape) => T =
    pattern => shape => pattern[shape._shapeType](shape as never)

export const area: (x: Shape) => number = matcher<number>({
    Circle: c => Math.PI * c.r * c.r,
    Rect: r => r.h * r.d,
})
export const circ: (x: Shape) => number = matcher<number>({
    Circle: c => c.r * c.r * Math.PI,
    Rect: r => 2 * r.h * r.d,
})
