global.MapHelper = {

  // Determine the layer type and index from its name. This is a convention
  // that needs to be followed in the map editor.
  //
  //   Current Valid Names: [extra, root, regions, extended]
  //
  parseLayerName: function(name) {
    const matches = name.match(/(\w+) (\d+)/);
    return {
      type: matches[1].toLowerCase(),
      index: parseInt(matches[2]) - 1,
    };
  }

};