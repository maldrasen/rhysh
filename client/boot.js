import load from './loader.js'

(function() {
  console.log('=== Booting Client ===');

  try {
    load();

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
