import { getRandomInt } from './helpers';

// Does a simple algorithm: Selects initial people at random then replaces people
// to see if they improve the score. It saves the best replacement for each person
const selectFocusGroup = (people, constraints, size) => {
  if (size >= people.length) { return people; }

  let focusGroup = grabRandomFocusGroup(people, size);

  for (let tries = 0; tries < 4; tries++) {
    for (let i = 0; i < people.length; i++) {
      focusGroup = tryPersonInGroup(i, people, focusGroup, constraints);
    }
  }

  return focusGroup;
};

const getAccuracyOfFocusGroup = (group, constraints) => {
  const score = scoreDataset(group, constraints);

  const constraintBounds = getConstraintBounds(constraints);

  return `${(constraintBounds - score) / constraintBounds * 100}%`;
};

// Tries to see if a person is a better fit in the group. Finds its optimal swap
// and replaces that person. If no swap, it returns the same group.
//
// Returns a focus group object.
const tryPersonInGroup = (id, people, group, constraints) => {
  // Person is in group already
  if (group[id] != null) { return group; }

  let minId = null;
  let minScore = scoreDataset(group, constraints);

  for (const personId in group) {
    if (group.hasOwnProperty(personId)) {
      const hold = group[personId];
      group[personId] = people[id];

      // Try to see score replacing each person
      const score = scoreDataset(group, constraints);
      group[personId] = hold;

      // Find the best replacement
      if (score < minScore) {
        minId = personId;
        minScore = score;
      }
    }
  }

  if (minId != null) {
    delete group[minId];
    group[id] = people[id];
  }

  return group;
};

// Returns a JS Object with random people using their 'index' as keys to identify them
const grabRandomFocusGroup = (people, size) => {
  const grabbed = {};
  while (Object.keys(grabbed).length < size) {
    const index = getRandomInt(0, people.length);
    if (grabbed[index] === undefined) { grabbed[index] = people[index]; }
  }

  return grabbed;
};

const getConstraintBounds = (constraints) => {
  let size = 0;
  for (const constraint of constraints) { size += constraint.count; }

  return size;
};

// Returns the score of a set of people and how closely they follow
// a set of constraints.
// People Array: [ {age: "10-20", ...} ]
// Constraints Array: [ {category: "age", target: "10-20", count: 4 } ]
const scoreDataset = (people, constraints, getOffset = false) => {
  const group = Object.keys(people).reduce((prev, current) => prev.concat(people[current]), []);
  let score = 0;

  for (const constraint of constraints) {
    score += scoreConstraint(group, constraint, getOffset);
  }

  return score;
};

const calculateUnmetCriteria = (people, constraints) => {
  const unmetCriteria = [];

  for (const constraint of constraints) {
    const offset = scoreDataset(people, [constraint], true);

    if (offset !== 0) {
      constraint.offset = offset;
      unmetCriteria.push(constraint);
    }
  }

  return unmetCriteria;
};


// Returns the score for a given constraint, this is defined as the difference
// between actual matches to a category and expected matches.
const scoreConstraint = (people, constraint, getOffset = false) => {
  let matches = 0;

  for (const person of people) {
    if (personFitsConstraint(person, constraint)) {
      matches++;
    }
  }

  const score = matches - constraint.count;
  return getOffset ? score : Math.abs(score);
};

// Return true if a person matches the given constraint
// Return false if a person fails a given constraint
const personFitsConstraint = (person, constraint) => {
  const category = constraint.category;
  const target = constraint.target;
  let actual = person[category];

  if (category === 'ethnicity' && actual.toLowerCase().startsWith('white')) {
    actual = 'White';
  }

  return (Array.isArray(actual) ? actual[0] : actual).includes(target);
};

export default {
  personFitsConstraint,
  scoreConstraint,
  tryPersonInGroup,
  selectFocusGroup,
  calculateUnmetCriteria,
  getAccuracyOfFocusGroup,
};
