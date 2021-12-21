export interface Bifunctor<A, B> {
    bimap: <C,D>(f: (a: A) => C) => (g: (b: B) => D ) => Bifunctor<C, D>;
}
