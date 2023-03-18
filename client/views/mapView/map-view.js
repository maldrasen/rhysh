// The map view is really just used to fetch and load the data into the map
// canvas. I suppose all of this could have gone into the canvas itself, but I
// think I'd like to keep the canvas focused on the map rendering while the
// view takes care of everything else.
//
// TODO: After pulling the zone preview parts out of this this is looking even
//       more useless. We should probably combine this and the canvas unless
//       something else gets added to the maps.
window.MapView = (function() {

  function reset() {
    MapCanvas.reset();
  }

  function isOpen() {
    return X.hasClass('#mapCanvas','hide') == false;
  }

  function showDungeon(options) {
    showMap({
      location: Vector.from(options.location),
      tileSource: new TileSource(options.tileSource),
    });
  }

  function showMap(options) {
    MapCanvas.show();
    MapCanvas.setLocation(options.location);
    MapCanvas.setTileSource(options.tileSource);
    MainContent.hideCover({ fadeTime:1000 });
  }

  function move(response) { MapCanvas.move(response); }

  return {
    name: "MapView",
    reset,
    isOpen,
    showMap,
    showDungeon,
    move,
  }

})();
