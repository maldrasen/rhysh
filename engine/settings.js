global.Settings = (function() {

  const filepath = `${DATA}/settings.json`;

  let $currentSettings = {
    lastWorld: null,
    worldCounter: 1,
    fontSize: 5,
    windowColor: 1,
    futaPronouns: 'shi',
  };

  // If the settings file exists we load it into the current settings. If it doesn't exist we save a file with the
  // default settings.
  function init() {
    fs.exists(filepath, exists => {
      exists ? load() : save();
    });
  }

  function set(key, value) { $currentSettings[key] = value; }

  function setAll(options) {
    set('fontSize',    options.fontSize);
    set('windowColor', options.windowColor);
    set('futaPronouns',options.futaPronouns);
  }

  function getAll() { return {...$currentSettings}; }
  function getFutaPronouns() { return $currentSettings.futaPronouns; }
  function getLastWorld() { return $currentSettings.lastWorld; }
  function getWorldCounter() { return $currentSettings.worldCounter; }
  function setLastWorld(world) { $currentSettings.lastWorld = world; }
  function incWorldCounter() { $currentSettings.worldCounter += 1; }

  function save() {
    fs.writeFile(filepath, JSON.stringify($currentSettings), (error) => {
      if (error) { throw `Error: Cannot save settings. ${error}` }
    });
  }

  function load() {
    fs.readFile(filepath, (error, data) => {
      if (error) { throw `Error: Cannot load settings. ${error}` }
      $currentSettings = JSON.parse(data);
    });
  }

  return {
    init,
    set,
    setAll,
    getAll,
    getFutaPronouns,
    getLastWorld,
    getWorldCounter,
    setLastWorld,
    incWorldCounter,
    save,
  };

})();
