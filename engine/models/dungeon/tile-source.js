global.TileSource = class TileSource {

  #name;
  #size;
  #layerOffset;
  #layers;
  #zMin;
  #zMax;

  constructor(properties) {
    this.#name = properties.name;
    this.#size = properties.size;
    this.#layerOffset = (properties.layerOffset || 0);
    this.#layers = [];

    this.#zMin = this.#layerOffset;
    this.#zMax = this.#layerOffset + this.#size.z

    forUpTo(this.#size.z, _ => {
      this.#layers.push(new Array(this.#size.x * this.#size.y));
    });
  }

  get name() { return this.#name; }
  get size() { return this.#size; }
  get layerOffset() { return this.#layerOffset; }
  get layers() { return this.#layers; }
  get zMin() { return this.#zMin; }
  get zMax() { return this.#zMax; }

  setSize(size) { this.#size = size; }

  getTile(index) { return this.getLayer(index.z)[this.tileIndex(index.x,index.y)]; }
  setTile(index, tile) { this.getLayer(index.z)[this.tileIndex(index.x,index.y)] = tile; }

  getLayer(z) { return this.#layers[z - this.#layerOffset]; }
  setLayer(z,layer) { this.#layers[z - this.#layerOffset] = layer; }

  // I'm storing the tiles in kind of a strange way. A FeatureTemplate has a
  // 3D volume of tiles, though they'll usually only be a single z-level.
  // There's a layer for each z level, and each layer has a 1D array of tiles
  // which is indexed as a 2D plane.
  tileIndex(x,y) { return x + (y * this.#size.x); }

  inRange(index) {
    if (index.x < 0 || index.x >= this.#size.x) { return false; }
    if (index.y < 0 || index.y >= this.#size.y) { return false; }
    if (index.z < this.#zMin || index.z >= this.#zMax) { return false; }
    return true;
  }

  // Tile iterator
  each(callback) {
    forRange(this.#zMin, this.#zMax, z => {
      forUpTo(this.#size.y, y => {
        forUpTo(this.#size.x, x => {
          let index = new Vector(x,y,z);
          callback(index, this.getTile(index));
        });
      });
    });
  }

  // Given a dungeon index get the neighboring tiles along with their indices. These indices could all be out of bounds
  // so we only include a neighbor entry if it's possible for one to exist. Even if it's possible that a neighboring
  // tile might exist, the tile itself may also be null.
  //   { N:{index:<>, tile:<>}, S:... }
  getNeighborTiles(index) {

    if (this.inRange(index) == false) {
      throw(`Error: Cannot get neighbor tiles. ${index} is not in range.`)
    }

    let neighbors = {};
    let n = index.translate(new Vector(0,-1,0));
    let s = index.translate(new Vector(0,1,0));
    let e = index.translate(new Vector(1,0,0));
    let w = index.translate(new Vector(-1,0,0));

    if (this.inRange(n)) { neighbors.N = { index:n, tile:this.getTile(n) }; }
    if (this.inRange(s)) { neighbors.S = { index:s, tile:this.getTile(s) }; }
    if (this.inRange(e)) { neighbors.E = { index:e, tile:this.getTile(e) }; }
    if (this.inRange(w)) { neighbors.W = { index:w, tile:this.getTile(w) }; }

    return neighbors;
  }

  // Because the feature will manipulate the tiles when it's built we need to
  // provide a deep copy of the layers when building features. We can't use
  // JSON serialization to do the deepcopy because we need the class objects
  // intact.
  copy() {
    let source = new TileSource({
      name: this.#name,
      size: this.#size,
    });

    source.#layers = this.#layers.map(layer => {
      return layer.map(tile => {
        return tile ? tile.copy() : null;
      });
    });

    return source;
  }

  forClient() {
    return {
      name: this.#name,
      size: this.#size,
      layerOffset: this.#layerOffset,
      layers: this.#layers.map(layer => {
        return layer.map(tile => {
          return tile ? tile.forClient() : null
        });
      }),
    };
  }

  static unpack(data) {
    let tileSource = new TileSource({
      name: data.name,
      size: Vector.from(data.size),
      layerOffset: data.layerOffset,
    });

    forUpTo(data.layers.length, layerIndex => {
      let z = layerIndex + data.layerOffset;
      let layer = data.layers[layerIndex];

      forUpTo(layer.length, index => {
        let x = index % data.size.x;
        let y = Math.floor(index / data.size.x);
        unpackTile(new Vector(x,y,z), layer[index], tileSource);
      });
    });

    return tileSource;
  }
}

function unpackTile(dungeonIndex, tileData, tileSource) {
  if (tileData == null) { return null; }

  try {
    let tile = Tile.unpack(tileData);
    tileSource.setTile(dungeonIndex, tile);
  }
  catch(error) {
    console.error(`Invalid Tile at ${dungeonIndex} > ${error}`);
  }
}

