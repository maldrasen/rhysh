global.CharacterBuilder = (function() {

  function buildMainCharacter(options) {
    let mainCharacter = new Character("Main");

    mainCharacter.setArchetypeCode(options.archetype);
    mainCharacter.setSpeciesCode(options.archetype);
    mainCharacter.setSex(options.sex);
    mainCharacter.setFirstName(options.firstName);
    mainCharacter.setLastName(options.lastName);
    mainCharacter.setAttributes(new Attributes(options.attributes));
    mainCharacter.save();

    return mainCharacter;
  }

  return {
    buildMainCharacter
  }

})();