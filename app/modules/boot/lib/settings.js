global.Settings = (function() {

  const defaultSettings = {
    metric: false,
  };

  const filepath = `${ROOT}/settings.json`;
  const settings = {};

  // The init() function reads the settings.json file for the player's settings.
  // If the file doesn't exist the default settings are used. The settings file
  // is only written when and if the settings are set.
  function init() {
    fs.exists(filepath, exists => {
      set(exists ? JSON.parse(fs.readFileSync(filepath)) : defaultSettings);
    });
  }

  // Should probably only be used by the specs to set everything back to its
  // default state.
  function reset() { set(defaultSettings); }

  // Change the settings without updating the settings file. This is used by
  // the specs to try different settings. The main application however should
  // always use update()
  function set(data) {
    settings.metric = !! data.metric;
  }

  async function update(data) {
    set(data);
    fs.writeFile(filepath, JSON.stringify(settings), (error) => {
      if (error) { `Error: Cannot save settings. ${error}` }
    });
  }

  function fetch() { return settings; }
  function metric() { return settings.metric; }

  return {
    init,
    reset,
    set,
    update,
    fetch,
    metric,
  };

})();
