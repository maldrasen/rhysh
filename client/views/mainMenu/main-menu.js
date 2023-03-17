window.MainMenu = (function() {

  let lastWorld;

  function init() {
    X.onClick('#mainMenu a.new-button', showNewGame);
    X.onClick('#mainMenu a.continue-button', continueGame);
    X.onClick('#mainMenu a.load-button', showLoadGame);
    X.onClick('#mainMenu a.options-button', OptionsOverlay.show);
    X.onClick('#mainMenu a.preview-features', previewFeatures);
    X.onClick('#mainMenu a.preview-zone', previewZone);
    X.onClick('#mainMenu a.warning-button', showWarnings);
    X.onClick('#contentWarnings a.close-button', hideWarnings);

    OptionsOverlay.build();
  }

  function setContext(context) {
    lastWorld = context.lastValidGame;
  }

  function showNewGame() {
    MainContent.reset();
    ClientCommands.send('game.new');
  }

  function continueGame() {
    MainContent.reset();
    ClientCommands.send('game.load', lastWorld.worldIndex);
  }

  function showLoadGame() {
    X.addClass('#mainMenu','hide');
    ClientCommands.send('game.show-load').then(gameList => {
      LoadGame.show(gameList);
    });
  }

  function previewFeatures() {
    MainContent.reset();
    ClientCommands.send('dungeon-builder.show-debug-feature');
  }

  function previewZone() {
    MainContent.reset();
    ClientCommands.send('dungeon-builder.show-debug-zone');
  }

  function show() {
    MainContent.show({ path:"client/views/mainMenu/main-menu.html", classname:'main-menu', background:'main-menu' }).then(() => {
      enableLoadButtons();
      MainContent.hideCover({ fadeTime:1000 });
      ScrollingPanel.build('#loadGame');
    });
  }

  function showWarnings() {
    X.addClass('#baseMenu','hide');
    X.removeClass('#contentWarnings','hide');
  }

  function hideWarnings() {
    X.removeClass('#baseMenu','hide');
    X.addClass('#contentWarnings','hide');
  }

  function enableLoadButtons() {
    if (lastWorld) {
      X.removeClass('#mainMenu .load-button','disabled');
      X.removeClass('#mainMenu .continue-button','disabled');
    }
  }

  return {
    name: "MainMenu",
    setContext: setContext,
    init: init,
    show: show,
    enableLoadButtons: enableLoadButtons,
  };

})();
