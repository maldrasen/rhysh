global.CharacterScrutinizer = (function() {

  function check(requirement) {
    let character = requirement.startsWith('player') ? getPlayer() : getActor(requirement);

    if (requirement.match(/\.archetype=/))       { return checkArchetypeEqual(character,requirement); }
    if (requirement.match(/\.species=/))         { return checkSpeciesEqual(character,requirement); }
    if (requirement.match(/\.species!=/))        { return checkSpeciesNotEqual(character,requirement); }
    if (requirement.match(/\.species\.is\(/))    { return checkSpeciesIn(character,requirement); }
    if (requirement.match(/\.species\.isNot\(/)) { return checkSpeciesNotIn(character,requirement); }

    if (requirement.match(/\.female/))     { return character.isFemale(); }
    if (requirement.match(/\.futa/))       { return character.isFuta(); }
    if (requirement.match(/\.male/))       { return character.isMale(); }
    if (requirement.match(/\.not-female/)) { return character.isNotFemale(); }
    if (requirement.match(/\.not-futa/))   { return character.isNotFuta(); }
    if (requirement.match(/\.not-male/))   { return character.isNotMale(); }

    if (requirement.match(/\.str/)) { return checkAttribute(character,_str,requirement); }
    if (requirement.match(/\.dex/)) { return checkAttribute(character,_dex,requirement); }
    if (requirement.match(/\.con/)) { return checkAttribute(character,_con,requirement); }
    if (requirement.match(/\.int/)) { return checkAttribute(character,_int,requirement); }
    if (requirement.match(/\.wis/)) { return checkAttribute(character,_wis,requirement); }
    if (requirement.match(/\.cha/)) { return checkAttribute(character,_cha,requirement); }

    throw `Unknown player requirement (${requirement})`
  }

  function getPlayer() {
    return CharacterLibrary.getMainCharacter();
  }

  // TODO: Get the actor, should be in the format "actor(M)"
  function getActor(requirement) {
    throw `Parse out actor from ${requirement}`
  }

  // Format: player.archetype=knight
  function checkArchetypeEqual(character, requirement) {
    return character.getArchetypeCode() == requirement.match(/=(.*)/)[1]
  }

  // Format: player.species=elf
  function checkSpeciesEqual(character, requirement) {
    return character.getSpeciesCode() == requirement.match(/=(.*)/)[1]
  }

  // Format: player.species!=elf
  function checkSpeciesNotEqual(character, requirement) {
    return character.getSpeciesCode() != requirement.match(/=(.*)/)[1]
  }

  // Format: player.species.is(nymph,satyr)
  function checkSpeciesIn(character, requirement) {
    let list = requirement.match(/is\((.*)\)/)[1].split(',');
    return list.indexOf(character.getSpeciesCode()) >= 0
  }

  // Format: player.species.isNot(elf,lupin)
  function checkSpeciesNotIn(character, requirement) {
    let list = requirement.match(/isNot\((.*)\)/)[1].split(',');
    return list.indexOf(character.getSpeciesCode()) < 0
  }

  // Format: player.int>10
  function checkAttribute(character, attribute, requirement) {
    let values = requirement.match(/([^<>=]+)(<|<=|=|>=|>)([^<>=]+)/);
    let attributeValue = character.getAttributes().getValue(attribute);
    return Scrutinizer.checkComparisonOperation(attributeValue,values[2],values[3])
  }

  return { check }

})();