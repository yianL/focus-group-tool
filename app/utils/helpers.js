const capitalize = (text) => `${text.charAt(0).toUpperCase()}${text.substr(1)}`;

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


export default {
  capitalize,
  getRandomInt
};
