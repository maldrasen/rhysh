global.BattleController = (function() {

  function init() {
    ipcMain.handle("battle.debug-start", () => {
      GameState.triggerBattle();
    });

    ipcMain.handle("battle.start-round", (payload, orders) => {
      Switchboard.renderBattleRound({
        battle: GameState.getCurrentBattle().pack(),
        combatRounds: new BattleEngine(orders).execute(),
      });
    });
  }

  return { init };

})();
