global.Controllers = (function() {

  function init() {
    DungeonController.init();
    GameController.init();
    RootController.init();
  }

  return { init };

})();
