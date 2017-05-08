import { STATES } from './constants';

const capitalize = (text) => text && `${text.charAt(0).toUpperCase()}${text.substr(1)}`;

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const getAvailableCandidates = (pool, availability, zipCodes) =>
  pool.filter(person =>
    person.state === STATES.DEFAULT
  ).filter(person =>
    availability.reduce((prev, curr) => prev || person.availability.includes(curr), false)
  ).filter(person =>
    !zipCodes || zipCodes.includes(person.zipCode)
  );

export default {
  capitalize,
  getAvailableCandidates,
  getRandomInt,
};
