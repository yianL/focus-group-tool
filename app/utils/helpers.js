const capitalize = (text) => `${text.charAt(0).toUpperCase()}${text.substr(1)}`;

const getRandomInt = (min, max) => {
  let min = Math.ceil(min);
  let max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


export default {
  capitalize,
  getRandomInt
};
