export default (function() {

  function init() {

  }

  function setProperties(properties) {
    this.sourceType = properties.sourceType;
  }

  function show() {
    MainContent.show({ path:"client/views/mapView/map-view.html", classname:'map-view' }).then(() => {
      MainContent.hideCover({ fadeTime:1000 });

      // One of these... depends on source... Needs to return just a tile source I think.
      // dungeon-builder.preview-features
      // dungeon-builder.preview-zone
      // dungeon-builder.show-dungeon
      // ClientCommands.send('')
    });
  }

  return {
    name: "MapView",
    init: init,
    show: show,
    setProperties: setProperties,
  }

})();

/*
      Got Pixi, not going to do anything with it though until we're building
      maps again.

      let app = new PIXI.Application({ width:800, height:600 });
      document.body.appendChild(app.view);

      let sprite = PIXI.Sprite.from('../assets/icons/rhysh-icon.png');
      app.stage.addChild(sprite);

      let elapsed = 0.0;
      app.ticker.add((delta) => {
        elapsed += delta;
        sprite.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
      });
*/

