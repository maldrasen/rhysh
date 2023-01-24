global.Zone = class Zone {

  constructor(name) {
    this.name = name;
  }

  static forPreview() {
    let options = Environment.debugOptions.zonePreview;
    console.log("TODO: Preview Zone")
    console.log(options)
    return {}
  }

  // === Persistance ===================================================================================================

  pack() {
    return {
      name: this.name,
      tileSource: this.tileSource,
    };
  }

  unpack(data) {
    console.log("TODO: Unpack raw JSON data.");
    // Create tileSource from JSON
    // Load data from map data
  }

  load() {
    return new Promise(resolve => {
      fs.access(this.filepath(), fs.constants.F_OK, notThere => {
        notThere ? this.createZone(resolve) : this.loadZone(resolve);
      });
    });
  }

  async createZone(callback) {
    const zoneLoader = new ZoneLoader(this);
    const properties = await zoneLoader.createZoneFromTemplate();

    this.tileSource = properties.tileSource;
    this.zoneData = properties.zoneData;

    Kompressor.write(this.filepath(), this.pack()).then(callback);

    callback(this);
  }

  // We know the zone file exists so load and unpack the JSON.
  loadZone(callback) {
    Kompressor.read(filepath()).then(data => {
      this.unpack(data);
      callback(this);
    });
  }

  filepath() {
    return `${GameState.getWorldPath()}/${this.name}.cum`;
  }

}
