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

/** Selects a random element from the given array */
export function randomSample<T>(arr: T[], exclude?: T) {
  arr = exclude ? arr.filter((value) => value !== exclude) : arr;
  return arr[(Math.random() * arr.length) | 0];
}

/** Generates random text for a message */
export function randomMessageText() {
  return randomSample(sampleTexts);
}

/** Generates a random first name */
export function randomFirstName() {
  return randomSample(sampleFirstNames);
}

/** Generates a random last name */
export function randomLastName() {
  return randomSample(sampleLastNames);
}

// Sample data
const sampleTexts = [
  'How are you doing today?',
  'Are you interested in seeing a movie tonight?',
  'What would you like for dinner?',
  'Have you seen the new movie?',
  'I forgot my raincoat at home!',
  "I'll be out of town for the next few weeks.",
  'Do you think our pets can secretly talk?',
  "I think I'll go to the library today.",
  'Let me know if you want me to bring you some food.',
  'Do you have any spare AA batteries?',
  'How was your day?',
  "I can't wait until this weekend",
  'I saw a super cute dog while out walking!',
  "I'm going to visit my grandparents today",
  'What was the name of that show you recommended?',
  "What's your favorite dessert?",
];

const sampleFirstNames = [
  'Ava',
  'Aiden',
  'Abigail',
  'Alex',
  'Emily',
  'Ezra',
  'Emma',
  'Elijah',
  'Layla',
  'Liam',
  'Logan',
  'Luna',
  'Olivia',
  'Owen',
  'Sophia',
  'Sam',
  'Stella',
];

const sampleLastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzales',
  'Wilson',
  'Anderson',
  'Thomas',
];
