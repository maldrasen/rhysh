global.ImageData = (function() {

  // TODO: The ImageData doesn't work like the rest of the data classes, but
  //       there's hardly anything here yet. May consider making image data
  //       into a class at some point and register images individually.
  //       Probably once we start tagging images with sex, species, lewdness
  //       and such.

  const backgrounds = [
    { file:'battle-town-1',  forZones:['Wolgur']},
    { file:'battle-cleft-1', forZones:['WolgurCleft']},
    { file:'battle-cleft-2', forZones:['WolgurCleft']},
    { file:'battle-cleft-3', forZones:['WolgurCleft']},
    { file:'battle-cleft-4', forZones:['WolgurCleft']},
    { file:'battle-cleft-5', forZones:['WolgurCleft']},
    { file:'battle-cleft-6', forZones:['WolgurCleft']},
    { file:'battle-glade-1', forZones:['HowlingGlade']},
    { file:'battle-glade-2', forZones:['HowlingGlade']},
    { file:'battle-glade-3', forZones:['HowlingGlade']},
    { file:'battle-glade-4', forZones:['HowlingGlade']},
  ]

  // TODO: Some zones like Wolgur are going to have interior and exterior
  //       cells. If a fight breaks out on a street we want to use an exterior
  //       'town' background, but if we're fighting in the blacksmith shop we
  //       want to use the blacksmith background instead. Getting the regions
  //       worked out is probably the best way to implement that though.
  //
  //       Right now this is just picking backgrounds based on the zone, it
  //       might be better for backgrounds to be tagged somehow, and match the
  //       background to the current state somehow? We'll try it like this for
  //       now though.
  //
  function pickBattleBackground() {
    let zone = GameState.getCurrentZoneName();
    let possible = [];

    backgrounds.forEach(background => {
      if (background.forZones.indexOf(zone) >= 0) {
        possible.push(background.file);
      }
    });

    return Random.from(possible);
  }

  return { pickBattleBackground };

})();