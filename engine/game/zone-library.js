global.ZoneLibrary = (function() {
  let $zoneCache = {};

  // === Zone Management =======================================================

  function clear() {
    $zoneCache = {};
  }

  // A zone is ready if it has already been put into the cache.
  function isZoneReady(name) {
    return $zoneCache[name] != null;
  }

  // If a zone is cached we can get it without a callback.
  function getCachedZone(name) {
    return $zoneCache[name];
  }

  // This function will get the cached copy of the zone if it's already been
  // loaded. If it's already been built this will read the zone file first,
  // then return the zone. If the zone has never been built it will be created
  // first.
  function getZone(name, callback) {
    isZoneReady(name) ? callback($zoneCache[name]) : loadZone(name).then(zone => callback(zone));
  }

  function loadZone(name) {
    console.log("Loading Zone:",name)

    return new Promise(resolve => {
      new Zone(name).load().then(zone => {
        $zoneCache[name] = zone;
        resolve(zone);
      });
    });
  }


// Zone cache just needs tile sources.
//   #tileSource;
//   forClient() {
//     return {
//       name: this.getName(),
//       displayName: this.getDisplayName(),
//       tileSource: this.#tileSource.forClient(),
//     }
//   }

//   // === Persistance ===========================================================

//   pack() {
//     return {
//       name: this.#name,
//       tileSource: this.#tileSource,
//     };
//   }

//   // Name is already set, so really the tile source is the only thing that
//   // needs to be set.
//   unpack(data) {
//     this.#tileSource = TileSource.unpack(data.tileSource);
//   }

//   load() {
//     return new Promise(async resolve => {
//       await this.getZoneData();
//       fs.access(this.filepath(), fs.constants.F_OK, notThere => {
//         notThere ? this.createZone(resolve) : this.loadZone(resolve);
//       });
//     });
//   }

//   async createZone(callback) {
//     const zoneLoader = new ZoneLoader(this);
//     const properties = await zoneLoader.createZoneFromTemplate();

//     this.#tileSource = properties.tileSource;
//     this.#zoneData = properties.zoneData;

//     // We can create a zone without saving it in a world.
//     if (GameState.getWorldPath()) {
//       Kompressor.write(this.filepath(), this.pack()).then(callback);
//     }

//     callback(this);
//   }

//   async getZoneData() {
//     if (this.#zoneData != null) { return this.#zoneData }
//     this.#zoneData = await DungeonBuilder.loadZoneData(this.#name);
//     return this.#zoneData;
//   }

//   // We know the zone file exists so load and unpack the JSON.
//   loadZone(callback) {
//     Kompressor.read(this.filepath()).then(data => {
//       this.unpack(data);
//       callback(this);
//     });
//   }

//   filepath() {
//     return `${GameState.getWorldPath()}/${this.#name}.cum`;
//   }

//   // === Preview ===============================================================

//   // Is broken...
//   static previewZone() {
//     let options = Environment.debugOptions.zonePreview;

//     ZoneLibrary.getZone(options.zone, zone => {
//       let origin = zone.zoneData.origins[options.origin];
//       let location = { x:origin.x, y:origin.y, z:origin.z };

//       Messenger.publish("browser.render", {
//         showView: "ZonePreview",
//         location: location,
//         zone: zone.forClient(),
//       });
//     });
//   }

// }




  return { clear, isZoneReady, getCachedZone, getZone, loadZone };

})();





