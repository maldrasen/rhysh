
global.AttributeNames = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

global.STR = 'str';
global.DEX = 'dex';
global.CON = 'con';
global.INT = 'int';
global.WIS = 'wis';
global.CHA = 'cha';

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

// Returns true if the value is betweem min and max (inclusive)
global.between = function(value, min, max) {
  return (value >= min) && (value <= max);
}
