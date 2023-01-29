
window.Renderer = (function() {

  function init() {
    ServerEvents.onRender((payload, viewState) => {
      render(viewState);
    });
  }

  function render(viewState) {
    console.log("Render:",viewState);

    if (viewState.showView) {
      return showView(viewState);
    }
  }

  function showView(viewState) {
    let showFunction = {
      Dungeon:        Dungeon.show,
      NewGame:        NewGame.show,
      TownBlacksmith: TownView.showBlacksmith,
      TownGuild:      TownView.showGuild,
      TownStore:      TownView.showStore,
      TownTavern:     TownView.showTavern,
      FeaturePreview: MapView.showFeaturePreview,
      ZonePreview:    MapView.showZonePreview,
    }[viewState.showView];

    if (showFunction == null) {
      return console.error(`Error: No view named "${viewState.showView}"`);
    }

    showFunction(viewState);
  }

  return { init }

})();
