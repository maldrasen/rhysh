
const X = function(query) {
  return document.querySelector(query)
}

X.withClass = function(query) {
  return document.getElementsByClassName(query)
}

export default X;
