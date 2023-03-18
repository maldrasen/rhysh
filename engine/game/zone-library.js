global.ZoneLibrary = (function() {
  let $zoneCache = {};

  // === Zone Management =======================================================

  function clear() {
    $zoneCache = {};
  }

  // A zone is ready if it has already been put into the cache.
  function isZoneReady(code) {
    return $zoneCache[code] != null;
  }

  // If a zone is cached we can get it without a callback.
  function getCachedZone(code) {
    return $zoneCache[code];
  }

  // This function will get the cached copy of the zone if it's already been
  // loaded. If it's already been built this will read the zone file first,
  // then return the zone. If the zone has never been built it will be created
  // first.
  function getZone(code, callback) {
    isZoneReady(code) ? callback($zoneCache[code]) : loadZone(code).then(zone => callback(zone));
  }

  function loadZone(code) {
    console.log("Loading Zone:",code)
    return new Promise(resolve => {
      Zone.lookup(code).load(zone => {
        console.log(" - loaded zone",zone)
        $zoneCache[code] = zone;
        resolve(zone);
      });
    });
  }

  return { clear, isZoneReady, getCachedZone, getZone, loadZone };

})();


// TODO: This needs to go somplace...

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
