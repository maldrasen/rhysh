global.Loader = (function() {

  const CoreModules = [
    'classes',
    'core',
    'helpers',
  ];

  const DataDirectories = [
    'character',
  ];

  const GameModules = [
    'dungeon',
    'dungeonBuilder',
    'forms',
    'game',
    'models',
    'scrutinizers',
  ];

  const Preload = [
    'core/messenger.js',
    'core/weaver.js',
    'forms/form.js',
    'models/model.js',
    'scrutinizers/central-scrutinizer.js',
  ];

  let complete = [];

  // The order that all the various scripts needs to be loaded in unfortunately complicated. The first stage loads all
  // of the core classes, opens a browser window, then starts the database when it receives a message back from the
  // browser.
  function loadFirstStage() {
    console.log(" - Loading core modules.")

    Preload.forEach(script => {
      loadFile(`${ROOT}/engine/${script}`);
    });

    CoreModules.forEach(directory => {
      loadDirectory(`${ROOT}/engine/${directory}`);
    });
  }

  // The second stage loads and initializes all the database classes.
  function loadSecondStage() {
    console.log(" - Loading game modules.")

    GameModules.forEach(directory => {
      loadDirectory(`${ROOT}/engine/${directory}`);
    });

    DataDirectories.forEach(directory => {
      loadDirectory(`${ROOT}/data/${directory}`);
    });
  }

  // Recursivly load all the javascripts in a directory.
  function loadDirectory(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path, { withFileTypes:true }).forEach(item => {
        if (item.isFile() && item.name.match(/\.js$/)) {
          loadFile(`${path}/${item.name}`);
        }
        if (item.isDirectory()) {
          loadDirectory(`${path}/${item.name}`);
        }
      })
    }
  }

  // Only require files once.
  function loadFile(path) {
    if (complete.indexOf(path) < 0) {
      complete.push(path);
      require(path);
    }
  }

  return {
    loadFirstStage,
    loadSecondStage,
    loadFile,
    loadDirectory
  };

})();
