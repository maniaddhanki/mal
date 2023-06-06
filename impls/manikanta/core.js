const { deepEqual } = require('./uitls.js');
const { MalList, MalVector, Malnil, MalSymbol, pr_str, createMalString, MalAtom } = require('./types.js');
const { read_str } = require('./reader.js');
const { readFileSync } = require('fs');


const ns = {
  '+': (...args) => args.reduce((a, b) => a + b),
  '*': (...args) => args.reduce((a, b) => a * b),
  '-': (...args) => args.reduce((a, b) => a - b),
  '/': (...args) => args.reduce((a, b) => a / b),

  '=': (...args) => args.every(a => {
    if (a instanceof MalList || a instanceof MalVector) {
      return deepEqual(a, args[0]);
    }

    const areNills = args.every(x => x instanceof Malnil);
    return areNills || a === args[0];
  }),

  '>': (...args) => args[0] > args[1],
  '>=': (...args) => args[0] >= args[1],
  '<': (...args) => args[0] < args[1],
  '<=': (...args) => args[0] <= args[1],
  'list': (...args) => new MalList(args),
  'list?': (...args) => args[0] instanceof MalList,
  'empty?': (...args) => args[0].isEmpty(),
  'count': (...args) => args[0].count(),

  'pr-str': (...args) => pr_str(createMalString(args.map(x => pr_str(x, true)).join(" ")), true),

  'println': (...args) => {
    const str = args.map(x => pr_str(x, false)).join(" ");
    console.log(str);
    return new Malnil();
  },

  'prn': (...args) => {
    const str = args.map(x => pr_str(x, true)).join(" ");
    console.log(str);
    return new Malnil();
  },

  'str': (...args) => createMalString(args.map(x => pr_str(x, false)).join("")),

  'read-string': (string) => read_str(string.value),
  'slurp': (fileName) => createMalString(readFileSync(fileName.value, 'utf-8')),

  'atom': (arg) => new MalAtom(arg),
  'atom?': (arg) => arg instanceof MalAtom,
  'deref': (atom) => atom.deref(),
  'reset!': (atom, val) => atom.reset(val),
  'swap!': (atom, func, ...args) => atom.swap(func, args),
  'cons': (value, list) => new MalList([value, ...list.value]),
  'concat': (list1, list2) => new MalList([...list1.value, ...list2.value])
}

module.exports = { ns };