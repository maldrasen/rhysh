global.DungeonBuilder = (function() {

  const FeatureList = [
    "Caves",
    "Farms"
  ]

  let tilemaps;

  let featureLibrary;
  let featureSets;

  async function load() {
    loadTilemaps().then(() => {
      loadFeatures();
    });
  }

  // === Tilemaps ======================================================================================================

  async function loadTilemaps() {
    return Promise.all([
      parseTilemap(`${ROOT}/modules/dungeonBuilder/data/tilemaps/rhysh-root.json`),
      parseTilemap(`${ROOT}/modules/dungeonBuilder/data/tilemaps/rhysh-extra.json`),
      parseTilemap(`${ROOT}/modules/dungeonBuilder/data/tilemaps/rhysh-extended.json`),
    ]).then(tilemaps => {
      tilemaps = {
        root: tilemaps[0],
        extra: tilemaps[1],
        extended: tilemaps[2],
      }
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

  function lookupTile(type, id) {
    let tile = tilemaps[type.toLowerCase()][id];
    return tile ? tile : console.error(`Error: Unknown Tile ${type}:${id}`);
  }

  // === Features ======================================================================================================

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

  // === Map and Data Files ============================================================================================

  async function loadZoneMap(name) { return loadMap("zones",name); }
  async function loadZoneData(name) { return loadData("zones",name); }
  async function loadFeatureMap(name) { return loadMap("features",name); }
  async function loadFeatureData(name) { return loadData("features",name); }

  async function loadMap(type, name) {
    return new Promise(resolve => {
      let path = `${ROOT}/modules/dungeonBuilder/data/${type}/${name}.json`;

      fs.readFile(path, (error, data) => {
        if (error) throw error;

        try {
          resolve(JSON.parse(data));
        } catch(error) {
          console.error(`Cannor Parse JSON ${path}`);
          console.error(error);
        }
      });
    });
  }

  async function loadData(type, name) {
    return new Promise(resolve => {
      let path = `${ROOT}/modules/dungeonBuilder/data/${type}/${name}Data.json`;
      fs.readFile(path, (error, data) => {
        if (error) throw error;
        try {
          resolve(JSON.parse(data));
        } catch(error) {
          console.error(`Cannor Parse JSON ${path}`);
          console.error(error);
        }
      });
    });
  }

  function parseLayerName(name) {
    const matches = name.match(/(\w+) (\d+)/);

    return {
      type: matches[1].toLowerCase(),
      index: parseInt(matches[2]) - 1,
    };
  }

  return {
    load: load,
    lookupTile: lookupTile,
    addTemplateToLibrary: addTemplateToLibrary,
    addTemplateToSet: addTemplateToSet,
    lookupFeatureTemplate: lookupFeatureTemplate,
    randomFeatureFromSet: randomFeatureFromSet,
    loadZoneMap: loadZoneMap,
    loadZoneData: loadZoneData,
    loadFeatureMap: loadFeatureMap,
    loadFeatureData: loadFeatureData,
    parseLayerName: parseLayerName,
  };

})();