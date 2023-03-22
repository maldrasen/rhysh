global.BattleController = (function() {

  function init() {
    ipcMain.handle("battle.debug-start", () => {
      GameState.triggerBattle();
    });

    ipcMain.handle("battle.start-round", (payload, orders) => {
      if (Environment.verbose) {
        console.log(`=== Render Combat Rounds (${GameState.getCurrentBattle().getRoundNumber()}) ===`);
      }

      Switchboard.renderBattleRound({
        battle: GameState.getCurrentBattle().pack(),
        combatRounds: new BattleEngine(orders).execute(),
      });
    });
  }

  return { init };

})();
