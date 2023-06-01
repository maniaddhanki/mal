class Malval {
  constructor(value) {
    this.value = value;
  }

  pr_str() {
    return this.value.toString();
  }
}

class MalSymbol extends Malval {
  constructor(value) {
    super(value);
  }
}

class MalList extends Malval {
  constructor(value) {
    super(value);
  }

  isEmpty() {
    return this.value.length === 0;
  }

  count() {
    return this.value.length;
  }

  pr_str() {
    return '(' + this.value.map(x => x.pr_str()).join(' ') + ')';
  }
}

class MalVector extends Malval {
  constructor(value) {
    super(value);
  }

  isEmpty() {
    return this.value.length === 0;
  }

  count() {
    return this.value.length;
  }

  pr_str() {
    return '[' + this.value.map(x => x.pr_str()).join(' ') + ']';
  }
}

class Malnil extends Malval {
  constructor() {
    super('nil');
  }

  count() {
    return 0;
  }

  pr_str() {
    return 'nil';
  }
}

module.exports = { Malval, MalSymbol, MalList, MalVector, Malnil };