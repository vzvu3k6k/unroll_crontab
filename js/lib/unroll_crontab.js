function* unrollCrontab(expressions) {
  if (expressions.length == 0) return;
  expressions.forEach(function(e) {
    e.next = e.interval.next();
  });
  for(;;) {
    expressions.sort(function(a, b) {
      return a.next - b.next;
    });
    yield expressions[0];
    if(expressions[0].interval.hasNext()) {
      expressions[0].next = expressions[0].interval.next();
    } else {
      expressions.shift();
    }
  }
}

module.exports = unrollCrontab;
