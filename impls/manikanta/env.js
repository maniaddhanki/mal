class Env {
  constructor(outer) {
    this.outer = outer;
    this.data = {};
  }

  add_symbols(binds, exprs) {
    for (let index = 0; index < binds.length; index++) {
      const symbol = binds[index].value;
      this.data[symbol] = exprs[index];
    }
  }

  set(symbol, value) {
    this.data[symbol.value] = value;
  }

  find(symbol) {
    if (this.data[symbol.value] !== undefined) {
      return this;
    }

    if (this.outer !== undefined) {
      return this.outer.find(symbol);
    }
  }

  get(symbol) {
    const env = this.find(symbol);

    if (!env) throw `${symbol.value} not found`;
    return env.data[symbol.value];
  }
}

module.exports = { Env };