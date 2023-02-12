global.PlayerScrutinizer = (function() {

  function check(requirement) {
    if (requirement.startsWith('player.archetype=')) { return checkArchetypeEqual(requirement) }
    throw `Unknown player requirement (${requirement})`
  }

  // Format: player.archetype=knight
  function checkArchetypeEqual(requirement) {
    return CharacterLibrary.getMainCharacter().getArchetypeCode() == requirement.match(/=(.*)/)[1]
  }

  return { check }

})();