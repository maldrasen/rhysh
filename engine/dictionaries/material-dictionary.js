global.MaterialDictionary = (function() {

// Special Armors:
//   Glass Armor
//   Ember Armor
//   Ivory Armor
//   Ebony Armor
//   Demonskin
//   Dragonscale

  const materials = {
    cloth:   { rarity:'normal', name:'Cloth',   ac:1, weight:'light'  },
    leather: { rarity:'normal', name:'Leather', ac:2, weight:'medium' },
    hide:    { rarity:'normal', name:'Hide',    ac:3, weight:'medium' },
    chain:   { rarity:'normal', name:'Chain',   ac:4, weight:'medium', maxDex:2, minStr:14 },
    scale:   { rarity:'normal', name:'Scale',   ac:5, weight:'medium', maxDex:1, minStr:15 },
    plate:   { rarity:'normal', name:'Plate',   ac:6, weight:'heavy',  maxDex:0, minStr:16 },
  };

  function get(code) {
    return { code, ...materials[code] };
  }

  function lookup(code) {
    if (materials[code] == null) { throw `Unknown Material: ${code}` }
    return { code, ...materials[code] };
  }

  return { get, lookup };

})();
