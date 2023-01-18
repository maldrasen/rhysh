
global.N = "N";
global.S = "S";
global.E = "E";
global.W = "W";

global.NSEW = function(callback) {
  [N,S,E,W].forEach(facing => callback(facing));
}
