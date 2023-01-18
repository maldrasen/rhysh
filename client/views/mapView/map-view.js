export default (function() {

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
        buildMap(data);
      });
    });
  }

  function buildMap(data) {
    console.log("Build Map From:",data);
    MainContent.hideCover({ fadeTime:1000 });
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

