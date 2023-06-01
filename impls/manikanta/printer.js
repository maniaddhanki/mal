const { malValue, Malval } = require('./types.js');

const pr_str = malValue => {
  if (malValue instanceof Malval) {
    return malValue.pr_str();
  }

  return malValue.toString();
};

module.exports = { pr_str };
