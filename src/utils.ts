// check if an input is an array
export function checkArray(arr) {
    // check if arr is array
    const result = Array.isArray(arr);
    if (!result) {
        throw new Error(`${arr} is not an array.`);
    }
    return result;
}

// check if an input is object
export function checkObject(input) {
    // check if input is an object
    return typeof input === 'object' && input !== null;
}

export function flatten(arr: any): any[] {
    return ([] as any[]).concat(...arr);
}

// Checks if value is an empty object or collection.
export const isEmpty = obj => [Object, Array].includes((obj || {}).constructor) && !Object.entries((obj || {})).length;