global.DungeonBuilder = (function() {

  const FeatureList = [
    "Caves",
    "Farms"
  ]

  let rhyshRoot;
  let rhyshExtra;
  let rhyshExtended;

  let featureLibrary;
  let featureSets;

  async function load() {
    loadTilemaps().then(() => {
      loadFeatures();
    });
  }

  async function loadTilemaps() {
    return Promise.all([
      parseTilemap(`${ROOT}/modules/dungeonBuilder/data/tilemaps/rhysh-root.json`),
      parseTilemap(`${ROOT}/modules/dungeonBuilder/data/tilemaps/rhysh-extra.json`),
      parseTilemap(`${ROOT}/modules/dungeonBuilder/data/tilemaps/rhysh-extended.json`),
    ]).then(tilemaps => {
      rhyshRoot = tilemaps[0];
      rhyshExtra = tilemaps[1];
      rhyshExtended = tilemaps[2];
    });
  }

  async function parseTilemap(path) {
    return new Promise(resolve => {
      fs.readFile(path, (error, data) => {
        if (error) throw error;

        let tilemap = {};
        JSON.parse(data).tiles.forEach(tile => {
          tilemap[tile.id] = tile;
        })

        resolve(tilemap)
      });
    });
  }

  function loadFeatures() {
    FeatureList.forEach(name => {
      new FeatureLoader(name).loadFeatures();
    });
  }

  function addTemplateToLibrary(template) {
    featureLibrary[template.name] = template;
  }

  // Features also can belong to a feature set. These are used to select random features when building the dungeon.
  // Biomes can draw features from many sets and sets may belong to many biomes.
  function addTemplateToSet(setName, templateName) {
    if (featureSets[setName] == null) { featureSets[setName] = []; }
    featureSets[setName].push(templateName);
  }

  function lookupFeatureTemplate(name) {
    return featureLibrary[name];
  }

  function randomFeatureFromSet(name) {
    return new Feature(Random.from(featureSets[name]));
  }

  return {
    load: load,
    addTemplateToLibrary: addTemplateToLibrary,
    addTemplateToSet: addTemplateToSet,
    lookupFeatureTemplate: lookupFeatureTemplate,
    randomFeatureFromSet: randomFeatureFromSet,
  };

})();