window.MapView = (function() {

  // The map view is really just used to fetch and load the data into the map canvas. I suppose all of this could have
  // gone into the canvas itself, but I think I'd like to keep the canvas focused on the map rendering while the view
  // takes care of everything else.
  function show(options) {
    let command;
    let tileSource;
    let location;
    let direction;

    const buildMap = function() {
      MapCanvas.show();
      MapCanvas.setOriginPoint(location);
      MapCanvas.setDirection(direction);
      MapCanvas.setTileSource(tileSource);
      MainContent.hideCover({ fadeTime:1000 });
    }

    // If we're rendering the Dungeon the renderer will have set the tile source, as well as the party's location and
    // direction.
    if (options.tileSource) {
      tileSource = new TileSource(options.tileSource);
      location = Vector.from(options.position.location);
      direction = options.position.direction;
    }

    MainContent.show({ path:"client/views/mapView/map-view.html", classname:'map-view' }).then(() => {
      if (tileSource) { return buildMap(); }

      // A dungeon will have the tile source set by the renderer. If we're previewing a zone or a feature though we
      // need to fetch the tile source from the server. Also if this is a preview we should go ahead and initilize the
      // preview keyboard commands to pan, zoom, and reload.
      if (options.sourceType == "Feature") {
        command = 'dungeon-builder.get-debug-feature';
        direction = "N";
        location = new Vector(0,0,0);
      }

      // If the source type is a Zone the preview should use one of the zone's origin points as the map origin point.
      // This will need to be set all the way back in the env.json though.
      if (options.sourceType == "Zone") {
        command = 'dungeon-builder.get-debug-zone';
        direction = "N";
        location = new Vector(0,0,0);
      }

      ClientCommands.send(command).then(data => {
        tileSource = new TileSource(data.tileSource);
        buildMap();
      });
    });
  }

  return {
    name: "MapView",
    show: show,
  }

})();
