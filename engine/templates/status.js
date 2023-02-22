global.Status = (function() {

  // TODO: Just a guess on how status will work. I know the bound status will
  //       prevent some abilities, but not all of them. So we need a way to
  //       determine which abilities are blocked by what binds. Each status
  //       effect may end up being it's own class perhaps?

  const StatusDictionary = {
    'bound-legs': { prevent:'use-of-legs' },
    'bound-arms': { prevent:'use-of-arms' },
    'bound-body': { prevent:'use-of-body' },
  }

  function lookup(status) {
    if (StatusDictionary[status] == null) { throw `Unknown Status: ${state}` }
    return StatusDictionary[status];
  }

  return { lookup };

})();
