global.Dungeon = (function() {

  let zoneCache = {};

  // This function will get the cached copy of the zone if it's already been loaded. If it's already been built this
  // will read the zone file first, then return the zone. If the zone has never been built it will be created first.
  function getZone(name, callback) {
    zoneCache[name] ? callback(zoneCache[name]) : loadZone(name).then(zone => callback(zone));
  }

  function loadZone(name) {
    return new Promise(resolve => {
      new Zone(name).load().then(zone => {
        zoneCache[name] = zone;
        resolve(zone);
      });
    });
  }

  return { getZone, loadZone }

})();





