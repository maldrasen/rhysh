
// X (or Exacto) is a super tiny replacement for jQuery, just a quick reimplementation of everything I would actually
// use from that library.
window.X = function(query) {
  return document.querySelectorAll(query)
}

X.body = function() { return document.getElementsByTagName('body')[0]; }
X.each = function(query, callback) { X(query).forEach(callback); }
X.first = function(query) { return X(query)[0]; }

X.remove = function(query) {
  X(query).forEach(element => { element.remove(); });
}

// === Events ==========================================================================================================

X.onClick = function(selector, callback) {
  window.addEventListener('click', event => {
    if (event.target.matches(".disabled") == false && event.target.matches(selector)) {
      callback(event);
    }
  });
}

X.onKeyDown = function(key, when, callback) {
  window.addEventListener('keydown', event => {
    if (event.key == key && when(event)) { callback(event); }
  });
}

X.onCodeDown = function(code, when, callback) {
  window.addEventListener('keydown', event => {
    if (event.keyCode == code && when(event)) { callback(event); }
  });
}

X.onWheelUp = function(when, callback) {
  window.addEventListener('wheel', event => {
    if (event.deltaY < 0 && when(event)) { callback(event); }
  });
}

X.onWheelDown = function(when, callback) {
  window.addEventListener('wheel', event => {
    if (event.deltaY > 0 && when(event)) { callback(event); }
  });
}

X.onEscape = function(when, callback)     { X.onCodeDown(27, when, callback); }
X.onArrowUp = function(when, callback)    { X.onCodeDown(38, when, callback); }
X.onArrowDown = function(when, callback)  { X.onCodeDown(40, when, callback); }
X.onArrowLeft = function(when, callback)  { X.onCodeDown(37, when, callback); }
X.onArrowRight = function(when, callback) { X.onCodeDown(39, when, callback); }

// === Classes =========================================================================================================

// These class manipulation function can all take either an element or a query selector. With hasClass() the function
// really only makes sense for a single element so it only considers the first element with the selector, indended for
// use with element IDs.
X.hasClass = function(arg, classname) {
  return (typeof arg == "string" ? X.first(arg) : arg).classList.contains(classname);
}

X.addClass = function(arg, classname) {
  if (typeof arg == "string") {
    return Array.from(document.querySelectorAll(arg)).forEach((element) => element.classList.add(classname));
  }
  arg.classList.add(classname);
}

X.removeClass = function(arg, classname) {
  if (typeof arg == "string") {
    return Array.from(document.querySelectorAll(arg)).forEach((element) => element.classList.remove(classname));
  }
  arg.classList.remove(classname);
}
