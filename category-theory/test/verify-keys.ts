export const verifyKeys: <T>(keys: Array<keyof T>) => (obj: { [key in keyof T]: unknown }) => unknown =
    <T>(keys: Array<keyof T>) =>
        (obj: { [key in keyof T]: unknown }) =>
            keys.reduce((prev, key: keyof T) => ({...prev, [key]: obj[key]}), {})
