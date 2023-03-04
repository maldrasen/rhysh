global.BattleController = (function() {

  function init() {
    ipcMain.handle("battle.debug-start", () => {
      GameState.triggerBattle();
    });

    ipcMain.handle("battle.start-round", (payload, orders) => {
      console.log("=== Start Round ===");
      console.log(orders);
    });
  }

  return { init };

})();
