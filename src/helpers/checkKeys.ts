export const checkKeys = (obj: string[], arr: string[]): boolean => {
    return obj.every(e => arr.includes(e.toLowerCase()));
};