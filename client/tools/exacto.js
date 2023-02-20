
// X (or Exacto) is a super tiny replacement for jQuery, just a quick
// reimplementation of everything I would actually use from that library.

window.X = function(query) {
  return document.querySelectorAll(query)
}

X.body = function() { return document.getElementsByTagName('body')[0]; }
X.each = function(query, callback) { X(query).forEach(callback); }
X.first = function(query) { return X(query)[0]; }

// === Create and Modify Elements -=============================================

// Either remove all elements that match the query string. There's no need for
// this to only work on a single element, just call element.remove() instead.
X.remove = function(query) {
  X(query).forEach(element => { element.remove(); });
}

X.empty = function(arg) {
  (typeof arg == "string" ? X.first(arg) : arg).replaceChildren();
}

X.fill = function(arg, element) {
  (typeof arg == "string" ? X.first(arg) : arg).replaceChildren(element);
}

X.createElement = function(string) {
  let element = document.createElement("div");
  element.setHTML(string);
  return element.children[0];
}

X.copyElement = function(selector) {
  return X.first(selector).cloneNode(true);
}

// === Events ==================================================================

X.onClick = function(selector, callback) {
  window.addEventListener('click', event => {
    if (event.target.matches(".disabled") == false && event.target.closest(selector)) {
      callback(event);
    }
  });
}

X.onInput = function(selector, callback) {
  window.addEventListener('keydown', event => {
    if (event.target.matches(".disabled") == false && event.target.closest(selector)) {
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
    // console.log("Code:",event.keyCode);
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
X.onPageUp = function(when, callback)     { X.onCodeDown(33, when, callback); }
X.onPageDown = function(when, callback)   { X.onCodeDown(34, when, callback); }
X.onArrowUp = function(when, callback)    { X.onCodeDown(38, when, callback); }
X.onArrowDown = function(when, callback)  { X.onCodeDown(40, when, callback); }
X.onArrowLeft = function(when, callback)  { X.onCodeDown(37, when, callback); }
X.onArrowRight = function(when, callback) { X.onCodeDown(39, when, callback); }

// === Classes =================================================================

// These class manipulation function can all take either an element or a query
// selector. With hasClass() the function really only makes sense for a single
// element so it only considers the first element with the selector, indended
// for use with element IDs.

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

X.classesExcept = function(element, classList) {
  let list = [];
  element.classList.forEach(classname => {
    if (classList.indexOf(classname) == -1) { list.push(classname); }
  });
  return list;
}

// === Style ===================================================================

// Who the fuck would name their function getBoundingClientRect() anyway?
X.getPosition = function(element) {
  return element.getBoundingClientRect();
}
