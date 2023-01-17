require('sqlite3').verbose();

global.Database = (function() {
  let database;

  let registeredModels = [];
  let persistedModels = [];
  let waiting = true;

  async function createDatabase() {
    resetLog();

    const { Sequelize } = require('sequelize');

    database = new Sequelize('sqlite://:memory:', {
      dialect: 'sqlite',
      operatorsAliases: [],
      logging: writeToLog,
    });

    await database.sync();

    Messenger.publish('database.created');
  }

  // Completely clear the database. This is called both by the specs and when
  // quitting the game. A model can be marked as immutable if, like Name,
  // this is an immutable data model and shouldn't be cleared between specs.
  async function clear() {
    await Promise.all(persistedModels.map(async model => {
      if (!model.immutable) {
        return await model.destroy({ where:{}, truncate:true });
      }
    }));
  }

  // === Logging ===

  function logFile() { return `${logDirectory()}/db.log`; }
  function logDirectory() { return `${DATA}/log`; }

  function resetLog() {
    try {
      if (fs.existsSync(logDirectory()) == false) {
        fs.mkdirSync(logDirectory());
      }
      if (fs.existsSync(logFile())) {
        fs.unlinkSync(logFile());
      }
    } catch(error) { throw error; }
  }

  function writeToLog(message) {
    if (Environment.databaseLogging) {
      fs.appendFile(logFile(), `${message}\n`, (error) => {
        if (error) { throw error; }
      });
    }
  }

  // === Database Schema Creation ===
  // Fully creating the database is a bit of a messy process. First all of the
  // model classes call the registerModel() function with themselves as soon as
  // their file is loaded.
  //
  // After the database is created in memory the load() function is triggered
  // from the DatabaseDirector. This function takes all of the registered
  // models and creates their schema in the in memory database. That then
  // triggers the data loading if there is any and sends the final ready
  // message. It's also possible for models to be registered at any time after
  // the database has been created. When that happens the schema for that model
  // is just created immeadietly.

  async function registerModel(model, options={}) {
    if (options.immutable) {
      model.immutable = true;
    }
    if (waiting) {
      registeredModels.push(model);
    } else {
      await activateModel(model);
    }
  }

  async function activateModel(model) {
    await model.createModel();
    await database.sync();

    persistedModels.push(model);

    Messenger.publish(`database.load.${model.name}`);
  }

  async function load() {
    await Promise.all(registeredModels.map(async model => {
      await activateModel(model);
    }));

    waiting = false;
    registeredModels = [];
  }

  return {
    createDatabase,
    clear,
    registerModel,
    load,
    getModels: () => { return persistedModels; },
    instance: () => { return database; },
  };

})();
