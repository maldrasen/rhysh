global.SkillDictionary = (function() {

  const skills = {
    athletics:    { attribute:STR }, // Grappling skill is based on athletics
    acrobatics:   { attribute:DEX }, // Getting past some events and perhaps also some sex skills?
    bondage:      { attribute:DEX }, // Tying up, getting untied, and general robe use
    stealth:      { attribute:DEX }, // Hide in shadows chance
    history:      { attribute:INT }, // Knowledge of the old Rhysh empire mostly
    wizardry:     { attribute:INT }, // Success in casting a spell
    mechanics:    { attribute:INT }, // Disarming and setting traps
    perception:   { attribute:WIS }, // Notice things in the dungeon, traps and shit
    appraisial:   { attribute:WIS }, // Get information about mosters and items.
    religion:     { attribute:WIS }, // Not sure, probably useful given we have cultists and shit.
    intimidation: { attribute:CHA }, // Some combat skills also might use intimidation
    seduction:    { attribute:CHA }, // Conversation and general sex skills
    persuasion:   { attribute:CHA }, // Might not use, but might as well include for now.
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
