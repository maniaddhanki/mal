const { deepEqual } = require('./uitls.js');
const { MalList, MalVector, Malnil, MalSymbol } = require('./types.js');


const ns = {
  '+': (...args) => args.reduce((a, b) => a + b),
  '*': (...args) => args.reduce((a, b) => a * b),
  '-': (...args) => args.reduce((a, b) => a - b),
  '/': (...args) => args.reduce((a, b) => a / b),

  '=': (...args) => args.every(a => {
    if (a instanceof MalList || a instanceof MalVector) {
      return deepEqual(a, args[0]);
    }
    return a === args[0];
  }),

  '>': (...args) => args[0] > args[1],
  '>=': (...args) => args[0] >= args[1],
  '<': (...args) => args[0] < args[1],
  '<=': (...args) => args[0] <= args[1],
  'list': (...args) => new MalList(args),
  'list?': (...args) => args[0] instanceof MalList,
  'empty?': (...args) => args[0].isEmpty(),
  'count': (...args) => args[0].count(),
  'prn': (...args) => {
    console.log(args[0]);
    return new Malnil();
  }
}

module.exports = { ns };