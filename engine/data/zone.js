const ZoneDictionary = {}

global.Zone = class Zone {

  static register(zone) {
    ZoneDictionary[zone.code] = zone;
  }

  static lookup(code) {
    if (ZoneDictionary[code] == null) { throw `Unknown Zone (${code})` }
    return ZoneDictionary[code];
  }

  static allCodes() {
    return Object.keys(ZoneDictionary);
  }

  #code;
  #name;
  #mapFilePath;

  #biomes;
  #exits;
  #extensions;
  #layers;
  #origins;
  #regions;

  constructor(code, options) {
    this.#code = code;
    this.#name = options.name;
    this.#mapFilePath = options.mapFilePath;

    this.#biomes = {};
    this.#exits = {};
    this.#extensions = {};
    this.#origins = {};
    this.#regions = {};
  }

  get code() { return this.#code; }
  get name() { return this.#name; }
  get mapFilePath() { return this.#mapFilePath; }

  get biomes() { return this.#biomes; }
  get exits() { return this.#exits; }
  get extensions() { return this.#extensions; }
  get layers() { return this.#layers; }
  get origins() { return this.#origins; }
  get regions() { return this.#regions; }

  addBiome(code,options) { this.#biomes[code] = options; }
  addExit(code,options) { this.#exits[code] = options; }
  setExtension(key,value) { this.#extensions[key] = value; }
  setLayers(layers) { this.#layers = layers; }
  addOrigin(code,vector) { this.#origins[code] = vector; }
  setRegions(regions) { this.#regions = regions; }
}
