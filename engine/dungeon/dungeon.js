global.Dungeon = (function() {

  let zoneCache;
  let currentZone;

  // Initial Dungeon state for a new game.
  function start() {
    zoneCache = {};
  }

  async function loadZone(name) {
    console.log(`Loading Zone - ${name}`)

    const zoneLoader = new ZoneLoader(name);

    // If the zones needs to be loaded
    zoneLoader.createZoneFromTemplate().then(() => {
      console.log("Done");
    })

    // currentZone = name;
    // zoneCache[currentZone] = zoneLoader.hasBeenBuilt() ?
    //   zoneLoader.loadZone() :
    //   zoneLoader.createZoneFromTemplate()
  }

  return { start, loadZone }

})();





