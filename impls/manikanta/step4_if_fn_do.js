const readline = require("readline");
const { read_str } = require("./reader.js");
const { pr_str } = require("./printer.js");
const { MalSymbol, MalList, Malval, MalVector, Malnil } = require("./types.js");
const { Env } = require("./env.js");
const { ns } = require('./core.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const isArray = Array.isArray;

const generateStack = function (list1, list2) {
  const stack = [];
  for (let index = 0; index < list1.length; index++) {
    stack.push([list1[index], list2[index]]);
  }
  return stack;
};

const deepEqual = function (list1, list2) {
  let stack = [[list1, list2]];

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

const isTrue = (arg) => !(arg === false) && !(arg instanceof Malnil);

const eval_ast = (ast, env) => {
  if (ast instanceof MalSymbol) {
    return env.get(ast);
  }

  if (ast instanceof MalList) {
    const newAst = ast.value.map(x => EVAL(x, env));
    return new MalList(newAst);
  }

  if (ast instanceof MalVector) {
    const newAst = ast.value.map(x => EVAL(x, env));
    return new MalVector(newAst);
  }

  return ast;
};

const READ = str => read_str(str);

const defImplementation = (ast, env) => {
  env.set(ast.value[1], EVAL(ast.value[2], env));
  return env.get(ast.value[1]);
};

const letImplementation = (ast, env) => {
  const new_env = new Env(env);
  const bindingList = ast.value[1].value;

  for (let index = 0; index < bindingList.length; index += 2) {
    new_env.set(bindingList[index], EVAL(bindingList[index + 1], new_env));
  }
  return EVAL(ast.value[2], new_env);
};

const doImplementation = (ast, env) => {
  const elementCount = ast.value.length - 1;

  for (let index = 1; index < elementCount; index++) {
    EVAL(ast.value[index], env);
  }

  return EVAL(ast.value[elementCount], env);
};

const ifImplementation = (ast, env) => {
  const predicate = EVAL(ast.value[1], env);
  const eval_index = isTrue(predicate) ? 2 : 3;
  return EVAL(ast.value[eval_index], env) || new Malnil();
};

const fnImplementation = (ast, env) => {
  const fn_env = new Env(env);
  const vars = ast.value[1].value;

  const fn_cljr = (...args) => {
    if (vars.length !== args.length) {
      throw 'Wrong number of arguments';
    }

    fn_env.add_symbols(vars, args);
    return EVAL(ast.value[2], fn_env);
  };

  fn_cljr.toString = () => "#<function>";
  return fn_cljr;
};

const EVAL = (ast, env) => {
  if (!(ast instanceof MalList)) {
    return eval_ast(ast, env);
  }

  if (ast.isEmpty()) {
    return ast;
  }

  switch (ast.value[0].value) {
    case 'def!': return defImplementation(ast, env);
    case 'let*': return letImplementation(ast, env);
    case 'do': return doImplementation(ast, env);
    case 'if': return ifImplementation(ast, env);
    case 'fn*': return fnImplementation(ast, env);
  }

  const [fn, ...args] = eval_ast(ast, env).value;
  return fn.apply(null, args);
};

const PRINT = malValue => pr_str(malValue);

const env = new Env();
for (key in ns) {
  env.set(new MalSymbol(key), ns[key]);
}

const rep = str => PRINT(EVAL(READ(str), env));

const repl = () =>
  rl.question('user> ', line => {
    try {
      console.log(rep(line));
    } catch (error) {
      console.log(error);
    };
    repl();
  });

repl();
