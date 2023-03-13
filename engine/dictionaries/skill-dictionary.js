global.SkillDictionary = (function() {

  const skills = {
    athletics:    { attribute:_str }, // Grappling skill is based on athletics
    acrobatics:   { attribute:_dex }, // Getting past some events and perhaps also some sex skills?
    bondage:      { attribute:_dex }, // Tying up, getting untied, and general robe use
    stealth:      { attribute:_dex }, // Hide in shadows chance
    history:      { attribute:_int }, // Knowledge of the old Rhysh empire mostly
    wizardry:     { attribute:_int }, // Success in casting a spell
    mechanics:    { attribute:_int }, // Disarming and setting traps
    perception:   { attribute:_wis }, // Notice things in the dungeon, traps and shit
    appraisial:   { attribute:_wis }, // Get information about mosters and items.
    religion:     { attribute:_wis }, // Not sure, probably useful given we have cultists and shit.
    intimidation: { attribute:_cha }, // Some combat skills also might use intimidation
    seduction:    { attribute:_cha }, // Conversation and general sex skills
    persuasion:   { attribute:_cha }, // Might not use, but might as well include for now.
  }

  function lookup(code) {
    if (skills[code] == null) { throw `Unknown Skill: ${code}` }
    return skills[code];
  }

  function allCodes() {
    return Object.keys(skills);
  }

  return { lookup, allCodes };

})();
