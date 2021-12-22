import {Functor} from './functor'

export type Const<A> = Functor<A>

export const makeConst: <A>() => Const<A> = () => ({
    fmap: <B>() => makeConst<B>(),
})
