export const map: <A, B>(x: (x1: A) => B) => (y: Array<A>) => Array<B> =
	func => original => original.map(func)

export const singleton: <A>(x: A) => Array<A> = x => [x];

export const concat: <A>(x: Array<Array<A>>) => Array<A> = <A>(x: Array<A[]>) => {

	const result = [...x.slice(0,1)[0]]
	const rest = x.slice(1)
	if(rest.length === 0){
		return result
	}

	return [...result, ...concat<A>( rest )]
}


