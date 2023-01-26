window.BackgroundImage = (function() {

  // Currently, I expect that all the background images will be pngs, and they'll all be located in the
  // /assets/backgrounds directory. I'd rather not have to do some kind of complicated image library thing like last
  // time if that can be avoided.
  function setBackground(code) {
    if (code == null) {
      return removeBackground();
    }

    X.first('#backgroundImage').setAttribute("style",`background-image:url('../assets/backgrounds/${code}.jpg')`);
  }

  function removeBackground() {
    X.first('#backgroundImage').removeAttribute("style");
  }

  return {
    setBackground: setBackground,
    removeBackground: removeBackground,
  }

})();
