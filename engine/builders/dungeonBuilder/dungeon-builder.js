
const FeatureList = [
  "Caves",
  "Farms"
]

let $featureLibrary = {};
let $featureSets = {};

global.DungeonBuilder = (function() {

  function buildAllZones() {
    console.log("OK, big refactor time...")
  }



  // === Features ==============================================================

  // function loadFeatures() {
  //   FeatureList.forEach(name => {
  //     new FeatureLoader(name).loadFeatures();
  //   });
  // }

  // function addTemplateToLibrary(template) {
  //   $featureLibrary[template.getName()] = template;
  // }

  // // Features also can belong to a feature set. These are used to select random
  // // features when building the dungeon. Biomes can draw features from many
  // // sets and sets may belong to many biomes.
  // function addTemplateToSet(setName, templateName) {
  //   if ($featureSets[setName] == null) { $featureSets[setName] = []; }
  //   $featureSets[setName].push(templateName);
  // }

  // function lookupFeatureTemplate(name) {
  //   return $featureLibrary[name];
  // }

  // function randomFeatureFromSet(name) {
  //   return new Feature(Random.from($featureSets[name]));
  // }

  // function randomFeatureFromSets(sets) {
  //   let featureList = []

  //   sets.forEach(setName => {
  //     if ($featureSets[setName]) {
  //       $featureSets[setName].forEach(featureName => {
  //         featureList.push(featureName);
  //       });
  //     }
  //   });

  //   return new Feature(Random.from(featureList));
  // }

  // // === Map and Data Files ====================================================

  // async function loadZoneMap(name) { return loadMap("zones",name); }
  // async function loadFeatureMap(name) { return loadMap("features",name); }
  // async function loadFeatureData(name) { return loadData("features",name); }

  // async function loadMap(type, name) {
  //   return new Promise(resolve => {
  //     let path = `${ROOT}/data/${type}/${name}.json`;

  //     fs.readFile(path, (error, data) => {
  //       if (error) throw error;

  //       try {
  //         resolve(JSON.parse(data));
  //       } catch(error) {
  //         console.error(`Cannor Parse JSON ${path}`);
  //         console.error(error);
  //       }
  //     });
  //   });
  // }

  // async function loadData(type, name) {
  //   return new Promise(resolve => {
  //     let path = `${ROOT}/data/${type}/${name}Data.json`;

  //     fs.readFile(path, (error, data) => {
  //       if (error) throw error;

  //       try {
  //         resolve(JSON.parse(data));
  //       } catch(error) {
  //         console.error(`Cannor Parse JSON ${path}`);
  //         console.error(error);
  //       }
  //     });
  //   });
  // }

  // function parseLayerName(name) {
  //   const matches = name.match(/(\w+) (\d+)/);

  //   return {
  //     type: matches[1].toLowerCase(),
  //     index: parseInt(matches[2]) - 1,
  //   };
  // }

  return {
    buildAllZones,
    // addTemplateToLibrary,
    // addTemplateToSet,
    // lookupFeatureTemplate: lookupFeatureTemplate,
    // randomFeatureFromSet: randomFeatureFromSet,
    // randomFeatureFromSets: randomFeatureFromSets,
    // loadZoneMap,
    // loadFeatureMap,
    // loadFeatureData,
    // parseLayerName,
  };

})();