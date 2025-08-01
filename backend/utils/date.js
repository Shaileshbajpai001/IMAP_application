 function get30DaysAgo() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date;
}

module.exports = get30DaysAgo;
