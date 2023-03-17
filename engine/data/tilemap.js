const TilemapDictionary = {}

global.Tilemap = class Tilemap {

  static register(code, filepath) {
    TilemapDictionary[code] = new Tilemap(code, filepath);
    TilemapDictionary[code].load();
  }

  static lookupTile(type, id) {
    let tile = TilemapDictionary[type.toLowerCase()].getTile(id);
    if (tile == null) { throw `Error: Unknown Tile ${type}:${id}`; }
    return tile;
  }

  #code;
  #filepath;
  #tiles;

  constructor(code, filepath) {
    this.#code = code;
    this.#filepath = filepath;
    this.#tiles = {};
  }

  load() {
    JSON.parse(fs.readFileSync(this.#filepath)).tiles.forEach(tile => {
      this.#tiles[tile.id] = tile;
    });
  }

  getTile(id) { return this.#tiles[id]; }
}

Tilemap.register(_root,`${ROOT}/data/tilemaps/rhysh-root.json`)
Tilemap.register(_extra,`${ROOT}/data/tilemaps/rhysh-extra.json`)
Tilemap.register(_extended,`${ROOT}/data/tilemaps/rhysh-extended.json`)
