window.MapCanvas = (function() {

  let tileSource;
  let application;
  let tileField;

  function init() {
    window.addEventListener("resize", handleResize);
    createApplication();
  }

  function createApplication() {
    application = new PIXI.Application({
      autoStart: false,
      resizeTo: window,
    });

    X.first("#mapCanvas").appendChild(application.view)
  }

  function show() {
    application.resize();
    application.start();
    X.first("#mapCanvas").removeAttribute('class');
  }

  function hide() {
    application.stop();
    X.first("#mapCanvas").setAttribute('class','hide');
  }

  function setTileSource(source) {

    if (tileField) {
      application.removeChild(tileField);
      tileField.destroy({ children:true });
    }

    tileSource = source
    tileField = new PIXI.Container();
    application.stage.addChild(tileField);

    addTiles();
    positionField();
  }

  function addTiles() {
    console.log("Add Tiles from ",tileSource);
  }

  function handleResize() {
    if (tileField) {
      application.resize();
      positionField();
    }
  }

  // This is going to be tricky... I feel like I want to be able to move the
  // pivot around, not the location, but that doesn't seem to work with the
  // rotation...
  function positionField() {
    tileField.x = application.screen.width / 2;
    tileField.y = application.screen.height / 2;
    // tileField.pivot.x = -application.screen.width / 2;
    // tileField.pivot.y = -application.screen.height / 2;

    // application.ticker.add((delta) => {
    //     tileField.rotation -= 0.01 * delta;
    // });

  }





  return {
    init: init,
    show: show,
    hide: hide,
    setTileSource: setTileSource,
  }

})();
