global.ViewState = (function() {

  let gameState;

  function render(gameState) {
    if (gameState.event) { return renderEvent(gameState); }

    if (gameState.stage.view) {
      return Messenger.publish("browser.render",{ showView:gameState.stage.view });
    }

    if (gameState.stage.control == "Dungeon") { return renderDungeon(gameState); }
    if (gameState.stage.control == "Battle")  { return renderBattle(gameState);  }
  }

  async function renderEvent(gameState) {
    let renderer = new EventRenderer(gameState.event.code, gameState.event.state);

    Messenger.publish("browser.render",{
      showView: "Event",
      event: await renderer.render(),
    });
  }

  function renderBattle(gameState) {
    Messenger.publish("browser.render",{
      showView: "Battle",
    });
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
