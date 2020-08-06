/**
 * See {@link https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions}
 * for details on how to use this but basically you add this to your
 * default clause in a switch statement to check that you have handled
 * all types of a discriminated union:
 *
 * <code><pre>
 * switch (obj.type) {
 *     case TYPE_ENUM.TypeA: ...
 *     case TYPE_ENUM.TypeB: ...
 *     default: checkExhaustive(obj)
 * }
 *
 * </pre></code>
 */
export const checkExhaustive = (x: never): never => {
	throw new Error('Unexpected object: ' + JSON.stringify(x))
}
