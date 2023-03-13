
global.NSEW = function(callback) {
  [_N,_S,_E,_W].forEach(facing => callback(facing));
}

global.oppositeDirection = function(direction) {
  return { N:_S, S:_N, E:_W, W:_E }[direction];
}

// === Loops ===

// For each i in range 0(inclusive) - count(exclusive)
global.forUpTo = function(count, callback) {
  for (let i=0; i<count; i++) { callback(i); }
}

// For each i in range min(inclusive) - max(exclusive)
global.forRange = function(min, max, callback) {
  for (let i=min; i<max; i++) { callback(i); }
}
