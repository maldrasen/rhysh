global.ArmorMaterial = (function() {

  const materials = {
    cloth:   { name:'Cloth',   ac:1, weight:'light'  },
    leather: { name:'Leather', ac:2, weight:'medium' },
    hide:    { name:'Hide',    ac:3, weight:'medium' },
    chain:   { name:'Chain',   ac:4, weight:'medium', maxDex:2, minStr:14 },
    scale:   { name:'Scale',   ac:5, weight:'medium', maxDex:1, minStr:15 },
    plate:   { name:'Plate',   ac:6, weight:'heavy',  maxDex:0, minStr:16 },
  };

  function lookup(code) {
    return { code, ...materials[code] };
  }

  return { lookup };

})();
