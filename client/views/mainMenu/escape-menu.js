window.EscapeMenu = (function() {

  function init() {
    X.onCodeDown(27, canShow, toggleMenu);
    X.onClick('#escapeMenu .button', hideMenu);
    X.onClick('#escapeMenu .quit-button', confirmQuit);
  }

  function canShow() {
    if (X.hasClass("#escapeMenu",'hide') == false) { return true; }
    if (X.hasClass('#mapCanvas','hide') == false) { return true; }

    let content = X.first("#mainContent > div");
    if (content == null) {
      return false;
    }

    // Visibility based on id of element inside of main content.
    return ['eventView'].indexOf(content.getAttribute('id')) >= 0;
  }

  function toggleMenu() {
    if (X.hasClass("#escapeMenu",'hide')) {
      X.removeClass('#escapeCover','hide');
      X.removeClass('#escapeMenu','hide');
    } else {
      X.addClass('#escapeCover','hide');
      X.addClass('#escapeMenu','hide');
    }
  }

  function hideMenu() {
    X.addClass('#escapeCover','hide');
    X.addClass('#escapeMenu','hide');
  }

  function confirmQuit() {
    Confirmation.show({
      text: `Quit to main menu? <br> Unsaved progress will be lost.`,
      onConfirm: () => {
        ClientCommands.send('game.quit');
        MainMenu.show();
      }
    });
  }

  return {
    init,
  };

})();
