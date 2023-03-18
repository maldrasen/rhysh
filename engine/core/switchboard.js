global.Switchboard = (function() {
  return { init: function() {

    // Starting the server opens a browser window, we then wait until the client is ready before doing anything else
    // here. This is mostly because including heavy libraries like Sequalize interefers with the client (it breaks the
    // development tools) so we have to ping pong a bit between the two to start.
    Messenger.subscribe("server.start", () => {
      console.log(" - Loading client modules.");

      Loader.loadDirectory(`${ROOT}/engine/controllers`);
      Loader.loadDirectory(`${ROOT}/engine/server`);

      FeatureSet.init();
      Browser.init();
      Controllers.init();
    });

  }};
})();
