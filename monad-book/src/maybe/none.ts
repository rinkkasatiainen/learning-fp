import {Nothing} from '../maybe'

export const none: () => Nothing = () => ({_maybeType: 'none'})
