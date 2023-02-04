global.Loader = (function() {

  const CoreModules = [
    'classes',
    'core',
    'helpers',
  ];

  const DataDirectories = [
    'character',
    'names',
  ];

  const GameModules = [
    'dungeon',
    'dungeonBuilder',
    'forms',
    'game',
    'scrutinizers',
  ];

  const Preload = [
    'core/messenger.js',
    'core/weaver.js',
    'scrutinizers/central-scrutinizer.js',
  ];

  let complete = [];

  function run() {
    Preload.forEach(script => {
      loadFile(`${ROOT}/engine/${script}`);
    });

    CoreModules.forEach(directory => {
      loadDirectory(`${ROOT}/engine/${directory}`);
    });

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
    run,
    loadFile,
    loadDirectory
  };

})();
