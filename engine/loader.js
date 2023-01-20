global.Loader = (function() {

  const FirstStage = [
    'classes',
    'core',
    'helpers',
  ];

  const SecondStage = [
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
    console.log(" - Loading first stage.")

    Preload.forEach(script => {
      loadFile(`${ROOT}/engine/${script}`);
    });

    FirstStage.forEach(directory => {
      loadDirectory(`${ROOT}/engine/${directory}`);
    });
  }

  // The second stage loads and initializes all the database classes.
  function loadSecondStage() {
    console.log(" - Loading second stage.")

    SecondStage.forEach(directory => {
      loadDirectory(`${ROOT}/engine/${directory}`);
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
