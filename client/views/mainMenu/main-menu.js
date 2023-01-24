window.MainMenu = (function() {

  let lastWorld;

  function init() {
    X.onClick('#mainMenu a.new-game', showNewGame);
    X.onClick('#mainMenu a.continue-button', continueGame);
    X.onClick('#mainMenu a.load-game', showLoadGame);
    X.onClick('#mainMenu a.show-options', showOptions);

    X.onClick('#mainMenu a.preview-features', previewFeatures);
    X.onClick('#mainMenu a.preview-zone', previewZone);
  }

  function setContext(context) {
    lastWorld = context.lastWorld;
  }

  function showNewGame() {
    MainContent.clear();
    MainContent.show({ path:"client/views/mainMenu/new-game.html", classname:'new-game', background:'new-game' }).then(() => {
      MainContent.hideCover({ fadeTime:2000 });
      NewGame.fadeIn();
    });
  }

  function showLoadGame() {
    MainContent.clear();
  }

  function showOptions() {
    MainContent.clear();
  }

  function continueGame() {
    MainContent.clear();
  }

  function previewFeatures() {
    MapView.setProperties({ sourceType:"Feature" });
    MainContent.setStage(MapView);
  }

  function previewZone() {
    MapView.setProperties({ sourceType:"Zone" });
    MainContent.setStage(MapView);
  }

  function show() {
    MainContent.show({ path:"client/views/mainMenu/main-menu.html", classname:'main-menu', background:'main-menu' }).then(() => {
      enableContinue();
      MainContent.hideCover({ fadeTime:1000 });
    });
  }

  function enableContinue() {
    let continueButton = X.first('#mainMenu .continue-button');

    if (lastWorld) {
      continueButton.setAttribute('href',`${continueButton.getAttribute('href')},${lastWorld}`);
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
