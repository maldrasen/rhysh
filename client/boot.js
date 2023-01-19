
// Components
import './components/main-content.js'

// Elements
import './elements/background-image.js'

// Helpers
import './helpers/random.js'
import './helpers/rhysh-helper.js'

// Models
import './models/tile-source.js'

// Tools
import './tools/template.js'
import './tools/exacto.js'

// Views
import "./views/mainMenu/main-menu.js"
import "./views/mapView/map-view.js"
import "./views/mapView/map-canvas.js"
import "./views/pauseMenu/pause-menu.js"

(function() {
  console.log('=== Booting Client ===');

  try {
    MainContent.init();
    MapCanvas.init();
    MainMenu.init();

    // Received a message from the server letting us know that the server has
    // completely finished loading now. This will happen sometime after the
    // "client.ready" message we send just below.
    ServerEvents.onReady((payload, environment) => {
      ready(environment);
    });

    ClientCommands.ready();

  } catch(e) {
    console.error("\n!!! Error Booting Client Process !!!\n");
    console.error(e);
  }

  function ready(environment) {
    window.Environment = environment;

    console.log(`Rhysh started in ${Environment.name} mode.`)

    document.title = Environment.debug ? "Rhysh (DEBUG)" : "Rhysh"
    X.remove('.loading');

    MainContent.setStage(MainMenu);
  }

})();
