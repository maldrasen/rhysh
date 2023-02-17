window.EscapeMenu = (function() {

  // TODO: Allow remapping of keys.
  const EscapeKey = 27;
  const F5 = 116;
  const F9 = 120;

  function init() {
    X.onCodeDown(EscapeKey, canSave, toggleMenu);
    X.onCodeDown(F5, canSave, quickSave);
    X.onCodeDown(F9, canLoad, quickLoad);

    X.onClick('#escapeMenu .button', hideMenu);
    X.onClick('#escapeMenu .options-button', MainMenu.showOptions);
    X.onClick('#escapeMenu .save-button', quickSave);
    X.onClick('#escapeMenu .quit-button', confirmQuit);
  }

  function canSave() {
    if (X.hasClass("#escapeMenu",'hide') == false) { return true; }
    if (X.hasClass('#mapCanvas','hide') == false) { return true; }

    let content = X.first("#mainContent > div");
    if (content == null) {
      return false;
    }

    // Visibility based on id of element inside of main content.
    return ['eventView'].indexOf(content.getAttribute('id')) >= 0;
  }

  // We cannot quick load when on the main menu or on the new game page because
  // there's no valid game to load.
  function canLoad() {
    let content = X.first("#mainContent > div");
    if (content) {
      return ['mainMenu','newGame'].indexOf(content.getAttribute('id')) < 0;
    }
    return true;
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
      text: `Quit to Main Menu? <br> Unsaved progress will be lost.`,
      onConfirm: () => {
        ClientCommands.send('game.quit');
        MainMenu.show();
      }
    });
  }

  function quickSave() {
    if (X.first('.save-game-alert') != null) { return; }

    ClientCommands.send('game.save').then(result => {
      if (result == 'success') {
        new Alert({
          message: 'Game Saved',
          position: 'side',
          classname: 'save-game-alert success'
        }).display();
      }
    });
  }

  function quickLoad() {
    console.log("Quick Load");
  }

  return {
    init,
  };

})();
