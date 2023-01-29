window.MainMenu = (function() {

  let lastWorld;

  function init() {
    X.onClick('#mainMenu a.load-game', showLoadGame);
    X.onClick('#mainMenu a.show-options', showOptions);
    X.onClick('#mainMenu a.preview-features', previewFeatures);
    X.onClick('#mainMenu a.preview-zone', previewZone);
  }

  function setContext(context) {
    lastWorld = context.lastWorld;
  }

  function showLoadGame() {
    console.log("TODO: Show Load Overlay");
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
