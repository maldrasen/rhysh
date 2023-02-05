global.Name = (function() {

  const Names = []

  function add(data, options) {
    let name = { name: data.name };

    // Options are applied globally over all the names in a name data file.
    // They can then be overridden by the name data, if nessessary.
    if (options.species) { name.species = options.species; }
    if (options.restriction) { name.restriction = options.restriction; }
    if (options.position) { name.position = options.position; }

    if (data.restriction) { name.species = data.restriction; }
    if (data.position) { name.position = data.position; }
    if (data.triggers) { name.triggers = data.triggers; }
    if (data.aspects) { name.aspects = data.aspects; }
    if (data.events) { name.events = data.events; }

    Names.push(name);
  }

  return { add };

})();