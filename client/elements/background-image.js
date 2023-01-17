export default (function() {

  function setBackground(code) {
    if (code == null) {
      return removeBackground();
    }

    X('#backgroundImage').setAttribute("style",`background-image:url('${code}.png')`);
  }

  function removeBackground() {
    X('#backgroundImage').removeAttribute("style");
  }

  return {
    setBackground: setBackground,
    removeBackground: removeBackground,
  }

})();
