global.Controllers = (function() {

  function init() {
    BattleController.init();
    DungeonController.init();
    GameController.init();
    RootController.init();
  }

  return { init };

})();
