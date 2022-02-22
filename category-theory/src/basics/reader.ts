import {Functor} from '../functor'


export interface Reader<A> extends Functor<A> {
    fmap: <B>(f: (a: A) => B) => Functor<B>;
}
