// Based off https://stackoverflow.com/a/1349426/688379

const RANDOM_ID_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export const makeRandomId = (length: number = 16): string => {
  return [...new Array(length)].map(() => RANDOM_ID_CHARACTERS.charAt(Math.floor(Math.random() * RANDOM_ID_CHARACTERS.length))).join('');
}
