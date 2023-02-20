global.ZoneInfo = (function() {

  // The ZoneInfo holds information about a zone pulled from the JSON data. This includes where the exits are, what
  // zones this connects to, all that. This is all just static data and doesn't change over the course of the game
  // so shouldn't need to be persisted. Structure:
  //
  //     name: Zone Name
  //     biomes: Biome Data (Raw from JSON)
  //     origins: { "WhenceName":{ index:Vector, facing:Facing }}
  //     exits:   { "WhitherName":{ visible:Bool, points:[Vector] }}
  //
  function build(name, zoneData) {

    let zoneInfo = {
      name:    name,
      biomes:  zoneData.biomes,
      origins: {},
      exits:   {},
    };

    // Change x, y, z in origin to vectors.
    for (const [code, origin] of Object.entries(zoneData.origins)) {
      zoneInfo.origins[code] = {
        index: new Vector(origin.x, origin.y, origin.z),
        facing: origin.facing
      };
    }

    for (const [code, exit] of Object.entries(zoneData.exits||{})) {
      zoneInfo.exits[code] = {
        visible: exit.visible,
        points: exit.points.map(p => new Vector(p.x, p.y, p.z)),
      }
    }

    return zoneInfo;
  }

  return { build }

})();

