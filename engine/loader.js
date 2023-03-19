global.Loader = (function() {

  // These are all the files where load order matter and should be loaded
  // before anything else.
  const Preload = [
    'constants.js',

    'builders/equipmentBuilders/equipment-builder.js',

    'data/stage.js',
    'data/selection-stage.js',

    'data/ability.js',
    'data/arcanum.js',
    'data/archetype.js',
    'data/condition-type.js',
    'data/event.js',
    'data/gnosis.js',
    'data/power.js',
    'data/species.js',
    'data/status-type.js',
    'data/story.js',

    'models/character.js',
    'models/monster.js',
    'models/dungeon/vector.js',

    'weavers/weaver.js',
  ];

  const CoreModules = [
    'core',
    'helpers',
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

  let complete = [];

  function run() {
    console.log("Loading Engine");

    Preload.forEach(script => {
      loadFile(`${ROOT}/engine/${script}`);
    });

    CoreModules.forEach(directory => {
      loadDirectory(`${ROOT}/engine/${directory}`);
    });

    GameModules.forEach(directory => {
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
    run,
    loadFile,
    loadDirectory
  };

})();
