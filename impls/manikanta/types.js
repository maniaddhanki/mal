const createMalString = (str) => {
  const string = str.replace(/\\(.)/g,
    (_, captured) => captured === "n" ? "\n" : captured);

  return new MalString(string);
}

const pr_str = (malValue, readable = false) => {
  if (malValue instanceof Malval) {
    return malValue.pr_str(readable);
  }

  return malValue.toString();
};

class Malval {
  constructor(value) {
    this.value = value;
  }

  pr_str(readable = false) {
    return this.value.toString();
  }
}

class MalSymbol extends Malval {
  constructor(value) {
    super(value);
  }
}

class MalSeq extends Malval {
  constructor(value) {
    super(value);
  }

  beginsWith(symbol) {
    return this.value.length > 0 && this.value[0].value === symbol;
  }

  isEmpty() {
    return this.value.length === 0;
  }

  count() {
    return this.value.length;
  }
}

class MalList extends MalSeq {
  constructor(value) {
    super(value);
  }

  beginsWith(symbol) {
    return this.value.length > 0 && this.value[0].value === symbol;
  }

  isEmpty() {
    return this.value.length === 0;
  }

  count() {
    return this.value.length;
  }

  pr_str(readable = false) {
    return '(' + this.value.map(x => pr_str(x, readable)).join(' ') + ')';
  }
}

class MalVector extends MalSeq {
  constructor(value) {
    super(value);
  }

  isEmpty() {
    return this.value.length === 0;
  }

  count() {
    return this.value.length;
  }

  pr_str(readable = false) {
    return '[' + this.value.map(x => pr_str(x, readable)).join(' ') + ']';
  }
}

class Malnil extends Malval {
  constructor() {
    super('nil');
  }

  count() {
    return 0;
  }

  pr_str(readable = false) {
    return 'nil';
  }
}

class MalString extends Malval {
  constructor(value) {
    super(value);
  }

  pr_str(print_readably = false) {
    if (print_readably) {
      return '"' + this.value
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n") + '"';
    }
    return this.value;
  }
}

class MalFunction extends Malval {
  constructor(ast, binds, env, func) {
    super(ast);
    this.func = func;
    this.binds = binds;
    this.env = env;
  }

  apply(cntxt, args) {
    console.log('inside apply');
    return this.func.apply(cntxt, args);
  }

  pr_str(readable = false) {
    return '#<function>';
  }
}

class MalAtom extends Malval {
  constructor(value) {
    super(value)
  }

  deref() {
    return this.value;
  }

  reset(val) {
    this.value = val;
    return this.value;
  }

  swap(f, args) {

    let func = f;
    if (f instanceof MalFunction) {
      func = f.func
    }
    this.value = func.apply(null, [this.value, ...args]);
    return this.value;
  }

  pr_str(readable = false) {
    return '(atom ' + pr_str(this.value, readable) + ')';
  }
}


module.exports = { Malval, MalSymbol, MalList, MalVector, Malnil, MalString, MalFunction, pr_str, createMalString, MalAtom, MalSeq };