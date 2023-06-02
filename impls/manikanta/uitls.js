const { MalList, MalVector, MalValue } = require("./types");

// const areArraysEqual = function (array1, array2) {
//   if (array1.length !== array2.length) {
//     return false;
//   }
//   for (let index = 0; index < array1.length; index++) {
//     if (!areEqual(array1[index], array2[index])) {
//       return false;
//     }
//   }

//   return true;
// };

// const deepEqual = function (a, b) {
//   const element1 = a instanceof MalValue ? a.value : a;
//   const element2 = b instanceof MalValue ? b.value : b;

//   if (Array.isArray(element1) && Array.isArray(element2)) {
//     return areArraysEqual(element1, element2)
//   }
//   return element1 === element2;
// };

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


module.exports = { deepEqual };
