
// === Directions ===

global.N = "N";
global.S = "S";
global.E = "E";
global.W = "W";
global.U = "U";
global.D = "D";

global.NSEW = function(callback) {
  [N,S,E,W].forEach(facing => callback(facing));
}

global.oppositeDirection = function(direction) {
  return { N:S, S:N, E:W, W:E }[direction];
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
