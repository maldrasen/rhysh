global.WeaponModeDictionary = (function() {

  const modes = {
    slash:    { hit:0,  damage:0 },
    shoot:    { hit:0,  damage:0 },
    bash:     { hit:-1, damage:2 },
    thrust:   { hit:-2, damage:4 },
    parry:    { special:true },
    riposte:  { special:true },
    entangle: { special:true },
  }

  function lookup(code) {
    if (modes[code] == null) { throw `Unknown Mode: ${code}` }
    return modes[code];
  }

  return { lookup };

})();
