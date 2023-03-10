global.Sector = (function() {

  // TODO: The couter and the dictionary will need to be persisted.
  let $sectorCounter = 1;
  let $sectorDictionary = {};

  function clear() {
    $sectorCounter = 1;
    $sectorDictionary = {};
  }

  function lookup(sector_id) {
    return $sectorDictionary[sector_id];
  }

  // When starting a new sector we want to make sure that the sector goes into the dictionary, but the creator of the
  // sector will mostly just want to know what the index is so it can make tiles in that sector. The sector data is
  // used to make groups of tiles with similar properties, things like light levels or encounter rates and such.
  // Because there are going to be a lot of sectors I don't think I need to put options like "light level" on each
  // sector itself. Rather, I'll just save a sector 'type' and consult the zone about what each sector means. There
  // will be standard sector types too so that each zone doesn't need to define every sector.
  // Options:
  //
  //   type:
  //     outside   - Outside on the top level, The sky should be drawn above
  //     building  - A single building. Could be many rooms connected with doors.
  //     hall      - Standard dungeon corridor
  //     room      - Standard dungeon room
  //
  function defineNextSector(options) {
    let sector_id = $sectorCounter + 1;

    if ($sectorDictionary[sector_id]) {
      throw `Error: Sector ${sector_id} has already been defined as ${$sectorDictionary[sector_id]}`;
    }

    $sectorDictionary[sector_id] = options;
    $sectorCounter += 1;

    return sector_id
  }

  function save() {
    Kompressor.write(`${GameState.getWorldPath()}/Sector.cum`,{
      sectorCounter: $sectorCounter,
      sectorDictionary: $sectorDictionary,
    });
  }

  async function load() {
    let state = await Kompressor.read(`${GameState.getWorldPath()}/Sector.cum`);
    $sectorCounter = state.sectorCounter;
    $sectorDictionary = state.sectorDictionary;
  }

  return {
    clear,
    lookup,
    defineNextSector,
    save,
    load,
  };

})();