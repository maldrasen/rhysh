global.Loader = (function() {

  const CoreModules = [
    'classes',
    'core',
    'helpers',
  ];

  const DataDirectories = [
    'characters',
    'events',
    'names',
  ];

  const GameModules = [
    'characters',
    'characterBuilder',
    'dungeon',
    'dungeonBuilder',
    'events',
    'game',
    'scrutinizers',
    'weavers',
  ];

  // TODO: Node has a built in message system. Use that instead.
  const Preload = [
    'core/messenger.js',
  ];

  let complete = [];

  function run() {
    console.log(" - Loading core modules");

    Preload.forEach(script => {
      loadFile(`${ROOT}/engine/${script}`);
    });

    CoreModules.forEach(directory => {
      loadDirectory(`${ROOT}/engine/${directory}`);
    });

    GameModules.forEach(directory => {
      loadDirectory(`${ROOT}/engine/${directory}`);
    });

    console.log(" - Loading data files");

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
