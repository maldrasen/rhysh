global.Loader = (function() {

  const Modules = [
    'classes',
    'core',
    'dungeon',
    'dungeonBuilder',
    'forms',
    'helpers',
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

  // TODO: Prolly won't work for test environment. We'll need to somehow know to exclude 'server' in test.
  function load() {
    Preload.forEach(script => {
      loadFile(`${ROOT}/engine/${script}`);
    });

    Modules.forEach(directory => {
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

  return { load, loadFile, loadDirectory };

})();
