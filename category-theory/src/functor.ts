
export interface Functor<A>{
    fmap: <B>(f: (a: A) => B) => Functor<B>;
}
