// https://medium.com/@fillopeter/pattern-matching-with-typescript-done-right-94049ddd671c
type MaybeKeys = 'none' | 'some'
interface MaybeType<T extends MaybeKeys> {
    _maybeType: T;
}

type MaybeMatcherMap<A, B> = {
    [K in MaybeKeys]: A extends { _maybeType: K } ? A : never
}
type MaybeTypeMap<A> = MaybeMatcherMap<Maybe<A>, A>
type Pattern<A, B> = {
    // 'none': () => Nothing;
    // 'some': (x: Just<A>) => B;
    [K in MaybeKeys]: (shape: MaybeTypeMap<A>[K]) => B
}


export type Nothing = MaybeType<'none'>

export interface Just<A> extends MaybeType<'some'> {
    _value: A;
}
export type Maybe<A> = Nothing | Just<A>
export const matcherMaybe: <A, B>(pattern: Pattern<A, B>) => (maybe: Maybe<A>) => B =
    // The type casting seems to work. As an alternative to 'any'
    pattern => m => pattern[m._maybeType](m as unknown as never)
