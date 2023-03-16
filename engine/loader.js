global.Loader = (function() {

  const CoreModules = [
    'core',
    'helpers',
  ];

  const DataDirectories = [
    'characters',
    'equipment',
    'events',
    'names',
  ];

  const GameModules = [
    'builders',
    'data',
    'dictionaries',
    'game',
    'members',
    'models',
    'renderers',
    'scrutinizers',
    'storyTellers',
    'weavers',
  ];

  // Superclasses in load order.
  const Preload = [
    'constants.js',
    'builders/equipmentBuilders/equipment-builder.js',
    'core/messenger.js',

    'data/ability.js',
    'data/arcanum.js',
    'data/archetype.js',
    'data/condition-type.js',
    'data/gnosis.js',
    'data/power.js',
    'data/species.js',
    'data/story.js',

    'models/character.js',
    'models/monster.js',
    'models/dungeon/vector.js',
    'weavers/weaver.js',
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
