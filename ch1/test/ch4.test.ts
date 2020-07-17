import { expect } from 'chai';

describe('Kleisli Categories, https://bartoszmilewski.com/2014/12/23/kleisli-categories/', () => {
	describe('Kleisli category for a partial function', () => {


		interface Optional<T> {
			value?: T
			isValid: boolean
		}

		type GetOptional<A> = (x: Optional<A>) => A | never
		type MapOptional<A, B> = (x: Optional<A>) => (y: (value: A) => Optional<B>) => Optional<B>

		const optionalOf: <A>(x?: A) => Optional<A> = value => {
			if (value === null || value === undefined) {
				return { value: undefined, isValid: false }
			}
			return { value, isValid: true }
		}

		// const getOptional: GetOptional<any> = <T>(optional: Optional<T>) => {
		// 	if (optional.isValid) {
		// 		return optional.value
		// 	}
		// 	throw new Error('Cannot get from Nothing')
		// }

		const mapOptional: <A,B>(optional: Optional<A>) => (y: (value: A) => Optional<B>) => Optional<B> =
			optional => func => {
				if( optional.isValid ){
					return func(optional.value)
				}
				return optionalOf<B>(null)
			}

		it('has composition', () => {
			const optional: Optional<string> = optionalOf('something')

			const toUpper: (x: string) => Optional<string> = (input: string) => optionalOf<string>(input.toUpperCase())

			const upcase = mapOptional(optional)(toUpper);
			expect(upcase).to.eql(optionalOf('something'.toUpperCase()))
		})

		it('has identity', () => {

		})
	});

});