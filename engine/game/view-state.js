global.ViewState = (function() {

  let gameState;

  function render(gameState) {
    // If there's a current event it takes highest priority and should be
    // rendered first. Otherwise render the current stage.

    // These views don't need any other data to be rendered.
    let basicView = {
      NewGame:        "NewGame",
      TownBlacksmith: "TownBlacksmith",
      TownGuild:      "TownGuild",
      TownStore:      "TownStore",
      TownTavern:     "TownTavern",
    }[gameState.stage]

    if (basicView) {
      return Messenger.publish("browser.render",{ showView:basicView });
    }

    Messenger.publish("browser.render", {
      Battle: renderBattle,
      Dungeon: renderDungeon,
    }[gameState.stage](gameState));
  }

  function renderEvent() {
    console.log("TODO: Render Event")
    return {};
  }

  function renderBattle(gameState) {
    console.log("TODO: Render Battle")
    return {};
  }

  function renderDungeon(gameState) {
    console.log("TODO: Render Dungeon")
    return {};
  }

  return { render }

})();
