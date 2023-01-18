export default (function() {

  let tileSource;
  let application;

  function init() {
    createApplication()
  }

  async function createApplication() {
    application = new PIXI.Application({
      autoStart: false,
      resizeTo: window,
      hello: true,
    });

    X.first("#mapCanvas").appendChild(application.view)
  }

  function show() {
    application.start();
    X.first("#mapCanvas").removeAttribute('class');
  }

  function hide() {
    application.stop();
    X.first("#mapCanvas").setAttribute('class','hide');
  }

  function setTileSource(source) {
    tileSource = source

    // TODO:
    //   Clear the stage.
    //   Add a field for the tiles.
    //   Create a sprite for each tile.
  }

  return {
    init: init,
    show: show,
    hide: hide,
    setTileSource: setTileSource,
  }

})();
