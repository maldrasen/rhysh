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

  function renderEvent(gameState) {
    let template = EventTemplate.lookup(gameState.event.code);

    // TODO: We need to pass the template through the weaver to complete the
    //       event. Should go through all of the old events too to see what
    //       else besides the stages we should pass in.

    Messenger.publish("browser.render",{
      showView:"Event",
      state: gameState.event.state,
      stages: template.data.stages,
    });
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
