window.MapView = (function() {

  function init() {

  }

  function setProperties(properties) {
    this.sourceType = properties.sourceType;
  }

  function show() {
    MainContent.show({ path:"client/views/mapView/map-view.html", classname:'map-view' }).then(() => {
      let command = {
        Feature: 'dungeon-builder.get-debug-feature',
        Zone: 'dungeon-builder.get-debug-zone',
        Dungeon: 'dungeon-builder.get-dungeon',
      }[this.sourceType];

      ClientCommands.send(command).then(data => {
        buildMap(new TileSource(data.tileSource));
      });
    });
  }

  function buildMap(source) {
    MapCanvas.show();
    MapCanvas.setTileSource(source);
    MainContent.hideCover({ fadeTime:1000 });
  }

  return {
    name: "MapView",
    init: init,
    show: show,
    setProperties: setProperties,
  }

})();
