global.ViewState = (function() {

  let gameState;

  function render(gameState) {
    // If there's a current event it takes highest priority and should be
    // rendered first. Otherwise render the current stage.

    if (gameState.stage.view) {
      return Messenger.publish("browser.render",{ showView:gameState.stage.view });
    }

    if (gameState.stage.control == "Dungeon") { return renderDungeon(gameState); }
    if (gameState.stage.control == "Battle")  { return renderBattle(gameState);  }
  }

  function renderEvent() {
    console.log("TODO: Render Event")
  }

  function renderBattle(gameState) {
    console.log("TODO: Render Battle")
  }

  function renderDungeon(gameState) {
    Dungeon.getZone(gameState.zone, zone => {
      Messenger.publish("browser.render", {
        showView: "Dungeon",
        location: gameState.location,
        zone: zone.forClient(),
      });
    });
  }

  return { render }

})();
