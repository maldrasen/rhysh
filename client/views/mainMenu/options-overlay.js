window.OptionsOverlay = (function() {

  function init() {
    X.onClick('#optionsOverlay a.close-button', close);
    X.onClick('#optionsOverlay a.save-button', save);
  }

  function build() {
    Template.load('#optionsOverlay','client/views/mainMenu/options-overlay.html');
  }

  function show() {
    let overlay = X.first('#optionsOverlay');
    let mainMenu = X.first('#mainMenu');

    if (mainMenu) {
      X.addClass(mainMenu,'hide');
    }

    X.removeClass(overlay,'hide');
  }

  function close() {
    X.addClass('#optionsOverlay','hide');
    X.removeClass('#mainMenu','hide');
  }

  function save() {

  }

  return {
    init,
    build,
    show
  };

})();