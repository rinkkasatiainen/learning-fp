export const flip: <A, B, C>(f: (arg1: A) => (arg2: B) => C) => (a2: B) => (a1: A) => C  =
    f => a2 => a1 => f(a1)(a2)
