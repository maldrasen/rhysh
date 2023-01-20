global.Switchboard = (function() {
  return { init: function() {

    Messenger.subscribe("database.start", () => {
      Database.createDatabase();
    });

    // Sent by the Database once it has been created.
    Messenger.subscribe("database.created", () => {
      Database.load().then(() => {
        Messenger.publish("database.ready");
      });
    });

    // Starting the server opens a browser window, we then wait until the client
    // is ready before doing anything else here. This is mostly because including
    // heavy libraries like Sequalize interefers with the client (it breaks the
    // development tools) so we have to ping pong a bit between the two to start.
    Messenger.subscribe("server.start", () => {
      Loader.loadDirectory(`${ROOT}/engine/server`);
      Browser.init();
    });

    // When the database is ready it's safe to initialize.
    Messenger.subscribe("database.ready", () => {
      DungeonBuilder.load();
    });

  }};
})();

