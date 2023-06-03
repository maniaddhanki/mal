const readline = require("readline");
const { read_str } = require("./reader.js");
const { pr_str } = require("./printer.js");
const { MalSymbol, MalList, Malval, MalVector, Malnil, MalString, MalFunction } = require("./types.js");
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
  const new_ast = new MalList([new MalSymbol('do'), new MalList(ast.value.slice(2))]);
  return [new_env, new_ast];
};

const doImplementation = (ast, env) => {
  const elementCount = ast.value.length - 1;

  for (let index = 1; index < elementCount; index++) {
    EVAL(ast.value[index], env);
  }

  return ast.value[elementCount];
};

const ifImplementation = (ast, env) => {
  const predicate = EVAL(ast.value[1], env);
  const else_block = ast.value[3] || new Malnil();
  return isTrue(predicate) ? ast.value[2] : else_block;
};

const fnImplementation = (ast, env) => {
  const [bindings, ...body] = ast.value.slice(1);
  const fnBody = new MalList([new MalSymbol('do'), ...body]);
  return new MalFunction(fnBody, bindings, env);

};

const EVAL = (ast, env) => {
  while (true) {
    if (!(ast instanceof MalList)) {
      return eval_ast(ast, env);
    }

    if (ast.isEmpty()) {
      return ast;
    }

    switch (ast.value[0].value) {
      case 'def!':
        return defImplementation(ast, env);
        break;

      case 'let*':
        [env, ast] = letImplementation(ast, env);
        break;

      case 'do':
        ast = doImplementation(ast, env);
        break;

      case 'if':
        ast = ifImplementation(ast, env);
        break;

      case 'fn*':
        ast = fnImplementation(ast, env);
        break;

      default:
        const [fn, ...args] = eval_ast(ast, env).value;

        if (fn instanceof MalFunction) {
          ast = fn.value;
          env = new Env(fn.env, fn.binds.value, args);
        } else {
          return fn.apply(null, args);
        }
    }
  }
};

const PRINT = malValue => pr_str(malValue);

const env = new Env();
for (key in ns) {
  env.set(new MalSymbol(key), ns[key]);
}

const rep = str => PRINT(EVAL(READ(str), env));

const not = rep('(def! not (fn* (a) (if a false true)))');

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
