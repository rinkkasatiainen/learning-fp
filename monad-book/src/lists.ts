export const map: <A, B>(x: (x1: A) => B) => (y: A[]) => B[] =
	func => original => original.map(func)

export const singleton: <A>(x: A) => A[] = x => [x]

export const concat: <A>(x: A[][]) => A[] = <A>(x: A[][]) => {
    const result = [...x.slice(0,1)[0]]
    const rest = x.slice(1)
    if(rest.length === 0){
        return result
    }

    return [...result, ...concat<A>( rest )]
}


