global.Zone = class Zone {

  constructor(name) {
    this.name = name;
  }

  forClient() {
    return {
      name: this.name,
      tileSource: this.tileSource.forClient(),
    }
  }

  // === Persistance ===================================================================================================

  pack() {
    return {
      name: this.name,
      tileSource: this.tileSource,
    };
  }

  // Name is already set, so really the tile source is the only thing that needs to be set.
  unpack(data) {
    this.tileSource = TileSource.unpack(data.tileSource);
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

    // We can create a zone without saving it in a world.
    if (GameState.getWorldPath()) {
      Kompressor.write(this.filepath(), this.pack()).then(callback);
    }

    callback(this);
  }

  async getZoneData() {
    if (this.zoneData != null) { return this.zoneData }
    this.zoneData = await DungeonBuilder.loadZoneData(this.name);
    return this.zoneData;
  }

  // We know the zone file exists so load and unpack the JSON.
  loadZone(callback) {
    Kompressor.read(this.filepath()).then(data => {
      this.unpack(data);
      callback(this);
    });
  }

  filepath() {
    return `${GameState.getWorldPath()}/${this.name}.cum`;
  }

  // === Preview ===============================================================

  static previewZone() {
    let options = Environment.debugOptions.zonePreview;

    Dungeon.getZone(options.zone, zone => {
      let origin = zone.zoneData.origins[options.origin];
      let location = { x:origin.x, y:origin.y, z:origin.z };

      Messenger.publish("browser.render", {
        showView: "ZonePreview",
        location: location,
        zone: zone.forClient(),
      });
    });
  }

}
