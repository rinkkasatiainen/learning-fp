// an alias for possible key types.
export type PatternKeys = string | number | symbol

// generic type of which matching can be done.
export interface PatternMatchingType<K extends PatternKeys> {
    _type: K;
}

// this might create the type safety for the matcher.
type TypeMatcherMap<K extends PatternKeys, A, B> = {
    [key in K]: A extends { _type: key } ? A : never
}

//
type PatternMap<K extends PatternKeys, A, B> = TypeMatcherMap<K, A, B>

export type Pattern<K extends PatternKeys, A, B> = {
    [key in K]: (shape: PatternMap<K, A, B>[key]) => B
}
export const matcher: <K extends PatternKeys, A extends PatternMatchingType<K>, B>(pattern: Pattern<K, A, B>) => (shape: A) => B =
    // The type casting seems to work. As an alternative to 'any'
    pattern => shape => pattern[shape._type](shape as any)
