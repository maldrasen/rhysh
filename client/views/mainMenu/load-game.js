window.LoadGame = (function() {

  function init() {
    X.onClick('#loadGame .back-to-main-button', showMainMenu);
  }

  function show(gameList) {
    console.log("Show Load Overlay With:",gameList);
    X.removeClass('#loadGame','hide');
  }

  function showMainMenu() {
    X.removeClass('#mainMenu','hide');
    X.addClass('#loadGame','hide');
    // TODO: Also empty game list.
  }

  return {
    init,
    show,
  };

})();