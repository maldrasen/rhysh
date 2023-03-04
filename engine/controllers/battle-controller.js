global.BattleController = (function() {

  function init() {
    ipcMain.handle("battle.debug-start", () => {
      GameState.triggerBattle();
    });

    ipcMain.handle("battle.start-round", (payload, orders) => {
      let events = new BattleEngine(orders).execute();
    });
  }

  return { init };

})();
