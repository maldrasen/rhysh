(function() {
  console.log('=== Booting Client ===');

  window.global = window
  window.TileSize = 64;

  try {
    importAll().then(() => {
      console.log("Import Complete");
      initAll();
      console.log("Init Complete");

      // Received a message from the server letting us know that the server has
      // completely finished loading now. This will happen sometime after the
      // "client.ready" message we send just below.
      ServerEvents.onReady((payload, environment) => {
        ready(environment);
      });

      ClientCommands.ready();
    });
  } catch(e) {
    console.error("\n!!! Error Booting Client Process !!!\n");
    console.error(e);
  }

  async function importAll() {
    return Promise.all([

      // Engine
      import('../engine/classes/vector.js'),
      import('../engine/helpers/array-helper.js'),
      import('../engine/helpers/object-helper.js'),
      import('../engine/helpers/random-helper.js'),
      import('../engine/helpers/rhysh-helper.js'),

      // Components
      import('./components/main-content.js'),

      // Elements
      import('./elements/background-image.js'),

      // Models
      import('./models/tile-entry.js'),
      import('./models/tile-source.js'),

      // Tools
      import('./tools/template.js'),
      import('./tools/exacto.js'),

      // Views
      import("./views/mainMenu/main-menu.js"),
      import("./views/mainMenu/new-game.js"),
      import("./views/mapView/map-view.js"),
      import("./views/mapView/map-canvas.js"),
      import("./views/mapView/tile-graphics.js"),
      import("./views/pauseMenu/pause-menu.js"),
    ]);
  }

  function initAll() {
    MainContent.init();
    MainMenu.init();
    MapCanvas.init();
    TileGraphics.init();
  }

  function ready(environment) {
    window.Environment = environment;

    console.log(`Rhysh started in ${Environment.name} mode.`)

    document.title = Environment.debug ? "Rhysh (DEBUG)" : "Rhysh"
    X.remove('.loading');

    MainContent.setStage(MainMenu);
  }




})();
