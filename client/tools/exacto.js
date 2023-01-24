
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

X.removeClass = function(query, classname) {
  Array.from(document.querySelectorAll(query)).forEach((element) => element.classList.remove(classname));
}
