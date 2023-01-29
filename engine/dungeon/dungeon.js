global.Dungeon = (function() {

  let zoneCache = {};

  // A zone is ready if it has already been put into the cache.
  function isZoneReady(name) {
    return zoneCache[name] != null;
  }

  // This function will get the cached copy of the zone if it's already been loaded. If it's already been built this
  // will read the zone file first, then return the zone. If the zone has never been built it will be created first.
  function getZone(name, callback) {
    isZoneReady(name) ? callback(zoneCache[name]) : loadZone(name).then(zone => callback(zone));
  }

  function loadZone(name) {
    console.log("Loading Zone:",name)

    return new Promise(resolve => {
      new Zone(name).load().then(zone => {
        zoneCache[name] = zone;
        resolve(zone);
      });
    });
  }

  return { isZoneReady, getZone, loadZone };

})();





