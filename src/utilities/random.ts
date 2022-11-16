/** Generates a random integer between min (inclusive) and max (inclusive) */
export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Generates a random boolean value */
export function randomBool() {
  return Math.random() < 0.5;
}

/**
 * **NOT CRYPTO SECURE!**
 * Generates a random UUID, should only be used for mock purposes
 * */
export function randomUUID() {
  return 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g, () => {
    return ((Math.random() * 16) | 0).toString(16);
  });
}
