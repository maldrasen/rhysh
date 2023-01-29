window.Dungeon = (function() {

  // I'm making the map view a child of the dungeon view. While this doesn't really seem nessessary now my intent is
  // for the Dungeon UI to also be a child of this view. This will include the character portraits and the buttons and
  // indicators and such that the previews didn't need.
  function init() {

  }

  function show(options) {
    MainContent.clear();
    MapView.showDungeon({
      position: options.position,
      tileSource: options.zone.tileSource,
    });
  }

  return {
    init,
    show,
  };

})();