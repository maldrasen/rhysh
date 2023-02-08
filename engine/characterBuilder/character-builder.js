global.CharacterBuilder = (function() {

  function buildMainCharacter(options) {
    let mainCharacter = new Character("MainCharacter");

    mainCharacter.setArchetypeCode(options.archetype);
    mainCharacter.setSpeciesCode(options.archetype);
    mainCharacter.setSex(options.sex);
    mainCharacter.setFirstName(options.firstName);
    mainCharacter.setLastName(options.lastName);

    return mainCharacter;
  }

  return {
    buildMainCharacter
  }

})();