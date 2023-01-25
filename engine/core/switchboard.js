global.Switchboard = (function() {
  return { init: function() {

    // Starting the server opens a browser window, we then wait until the client is ready before doing anything else
    // here. This is mostly because including heavy libraries like Sequalize interefers with the client (it breaks the
    // development tools) so we have to ping pong a bit between the two to start.
    Messenger.subscribe("server.start", () => {
      console.log(" - Loading client modules.");

      Loader.loadDirectory(`${ROOT}/engine/controllers`);
      Loader.loadDirectory(`${ROOT}/engine/server`);

      Browser.init();
      Controllers.init();
    });

    // Requiring Sequalize breaks Chrome's dev tools for some reason, so I have to wait until the client is finished
    // loading before we can start the database. The specs can start the database at any time though.
    Messenger.subscribe("database.start", () => {
      const { Sequelize, DataTypes } = require('sequelize');

      global.Sequelize = Sequelize;
      global.DataTypes = DataTypes;

      Database.createDatabase();
    });

    // Sent by the Database once it has been created.
    Messenger.subscribe("database.created", () => {
      Database.load().then(() => {
        Messenger.publish("database.ready");
      });
    });

    // When the database is ready it's safe to initialize.
    Messenger.subscribe("database.ready", () => {
      Loader.loadSecondStage();
      DungeonBuilder.load();
    });

  }};
})();
