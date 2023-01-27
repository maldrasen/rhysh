
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

X.onClick = function(selector, callback) {
  X.body().addEventListener('click', event => {
    if (event.target.matches(".disabled") == false && event.target.matches(selector)) {
      callback(event);
    }
  });
}

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
