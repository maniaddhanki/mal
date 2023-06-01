const { MalList, MalVector } = require("./types");

// deepEqual 
const isArray = Array.isArray;

const generateStack = function (list1, list2) {
  const stack = [];
  for (let index = 0; index < list1.length; index++) {
    stack.push([list1[index], list2[index]]);
  }
  return stack;
};

const deepEqual = function (list1, list2) {
  let stack = [[list1.value, list2.value]];

  while (stack.length > 0) {
    const lastElement = stack.pop();

    if (lastElement[0].length !== lastElement[1].length) {
      return false;
    }

    const areArrays = isArray(lastElement[0]) && isArray(lastElement[1]);
    if (areArrays) {
      stack = stack.concat(generateStack(lastElement[0], lastElement[1]));
    } else if (lastElement[0] !== lastElement[1]) {
      return false;
    }
  }
  return true;
};

exports.deepEqual = deepEqual;
