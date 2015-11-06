_.average = function average (arr) {
  return _.reduce(arr, function(memo, num) { return memo + num; }, 0) / arr.length || 0;
};
