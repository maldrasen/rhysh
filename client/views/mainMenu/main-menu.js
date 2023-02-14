window.MainMenu = (function() {

  let lastWorld;

  function init() {
    X.onClick('#mainMenu a.load-game', showLoadGame);
    X.onClick('#mainMenu a.show-options', showOptions);
    X.onClick('#mainMenu a.preview-features', previewFeatures);
    X.onClick('#mainMenu a.preview-zone', previewZone);
  }

  function setContext(context) {
    lastWorld = context.lastValidGame;
  }

  function showLoadGame() {
    X.addClass('#mainMenu','hide');
    ClientCommands.send('game.show-load').then(gameList => {
      LoadGame.show(gameList);
    });
  }

  function showOptions() {
    console.log("TODO: Show Options Overlay");
  }

  function previewFeatures() {
    MainContent.clear();
    ClientCommands.send('dungeon-builder.show-debug-feature');
  }

  function previewZone() {
    MainContent.clear();
    ClientCommands.send('dungeon-builder.show-debug-zone');
  }

  function show() {
    MainContent.show({ path:"client/views/mainMenu/main-menu.html", classname:'main-menu', background:'main-menu' }).then(() => {
      enableLoadButtons();
      MainContent.hideCover({ fadeTime:1000 });
      ScrollingPanel.build('#loadGame');
    });
  }

  function enableLoadButtons() {
    let continueButton = X.first('#mainMenu .continue-button');

    if (lastWorld) {
      continueButton.setAttribute('href',`#game.continue,${lastWorld.worldIndex}`);
      X.removeClass('#mainMenu .load-button','disabled');
      X.removeClass('#mainMenu .continue-button','disabled');
    }
  }

  return {
    name: "MainMenu",
    setContext, setContext,
    init: init,
    show: show,
  };

})();
