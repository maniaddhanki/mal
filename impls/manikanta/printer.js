const pr_str = malValue => {
  if (Array.isArray(malValue)) {
    return "(" + malValue.map(pr_str).join(" ") + ")";
  }

  return malValue.toString();
};
exports.pr_str = pr_str;
