
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
    PartyPanel.hide();

    let showFunction = {
      Battle:         BattleView.show,
      Dungeon:        Dungeon.show,
      Event:          EventView.show,
      NewGame:        NewGame.show,
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
