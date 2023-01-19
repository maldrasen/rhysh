
window.N = "N";
window.S = "S";
window.E = "E";
window.W = "W";

window.NSEW = function(callback) {
  [N,S,E,W].forEach(facing => callback(facing));
}

window.forUpTo = function(count, callback) {
  for (let i=0; i<count; i++) { callback(i); }
}
