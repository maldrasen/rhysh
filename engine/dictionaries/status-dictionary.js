global.StatusDictionary = (function() {

  // TODO: Just a guess on how status will work. I know the bound status will
  //       prevent some abilities, but not all of them. So we need a way to
  //       determine which abilities are blocked by what binds. Each status
  //       effect may end up being it's own class perhaps?

  const statuses = {
    'bound-legs': { prevent:'use-of-legs' },
    'bound-arms': { prevent:'use-of-arms' },
    'bound-body': { prevent:'use-of-body' },

    // The chest or leg armor has been stripped off or destroyed somehow. These
    // status effects don't prevent any actions, but influence story and
    // monster ability selection.
    'groin-exposed': {},
    'chest-exposed': {},
  }

  function lookup(code) {
    if (statuses[code] == null) { throw `Unknown Status: ${code}` }
    return statuses[code];
  }

  return { lookup };

})();
