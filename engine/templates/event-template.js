global.EventTemplate = (function() {
  const EventDictionary = {}

  function register(code, data) {
    EventDictionary[code] = { code, ...data };
  }

  function lookup(code) {
    if (EventDictionary[code] == null) { throw `Unknown Event [${code}]`; }
    return EventDictionary[code];
  }

  return {
    register,
    lookup,
  }

})();