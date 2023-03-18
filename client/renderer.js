window.Renderer = (function() {

  let $currentState;

  function init() {
    ServerEvents.onRender((payload, viewState) => {
      $currentState = viewState;
      render();
    });
  }

  function getCurrentState() {
    return $currentState;
  }

  function getCurrentWorld() {
    return ($currentState && $currentState.status) ? $currentState.status.worldIndex : null;
  }

  function render() {
    console.log("Render:",$currentState);
    if ($currentState.showView) {
      return showView();
    }
  }

  function showView() {
    PartyPanel.hide();

    let showFunction = {
      Battle:         BattleView.show,
      Dungeon:        Dungeon.show,
      Event:          EventView.show,
      NewGame:        NewGame.show,
      FeaturePreview: MapView.showFeaturePreview,
      ZonePreview:    MapView.showZonePreview,
    }[$currentState.showView];

    if (showFunction == null) {
      return console.error(`Error: No view named "${$currentState.showView}"`);
    }

    showFunction($currentState);
  }

  return {
    init,
    getCurrentState,
    getCurrentWorld,
  };

})();
