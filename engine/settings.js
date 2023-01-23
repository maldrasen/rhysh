global.Settings = (function() {

  const filepath = `${DATA}/settings.json`;

  let currentSettings = {
    lastWorld: null,
    worldCounter: 1,
  };

  // If the settings file exists we load it into the current settings. If it doesn't exist we save a file with the
  // default settings.
  function init() {
    fs.exists(filepath, exists => {
      exists ? load() : save();
    });
  }

  function getLastWorld() { return currentSettings.lastWorld; }
  function getWorldCounter() { return currentSettings.worldCounter; }

  function setLastWorld(world) { currentSettings.lastWorld = world; save(); }
  function incWorldCounter() { currentSettings.worldCounter += 1; save(); }

  function save() {
    fs.writeFile(filepath, JSON.stringify(currentSettings), (error) => {
      if (error) { throw `Error: Cannot save settings. ${error}` }
    });
  }

  function load() {
    fs.readFile(filepath, (error, data) => {
      if (error) { throw `Error: Cannot load settings. ${error}` }
      currentSettings = JSON.parse(data);
      console.log("Settings: ",currentSettings);
    });
  }

  return {
    init,
    getLastWorld,
    getWorldCounter,
    setLastWorld,
    incWorldCounter,
  };

})();
