global.BattleController = (function() {

  function init() {
    ipcMain.handle("battle.debug-start", () => {
      GameState.triggerBattle();
    });

    ipcMain.handle("battle.start-round", (payload, orders) => {
      BattleRenderer.renderCombatRound(new BattleEngine(orders).execute());
    });
  }

  return { init };

})();
