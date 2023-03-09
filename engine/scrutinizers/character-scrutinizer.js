global.CharacterScrutinizer = (function() {

  function check(requirement) {
    let character = requirement.startsWith('player') ? getPlayer() : getActor(requirement);

    if (requirement.match(/\.archetype=/)) { return checkArchetypeEqual(character,requirement); }
    if (requirement.match(/\.female/))     { return character.isFemale(); }
    if (requirement.match(/\.futa/))       { return character.isFuta(); }
    if (requirement.match(/\.male/))       { return character.isMale(); }
    if (requirement.match(/\.not-female/)) { return character.isNotFemale(); }
    if (requirement.match(/\.not-futa/))   { return character.isNotFuta(); }
    if (requirement.match(/\.not-male/))   { return character.isNotMale(); }

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

  return { check }

})();