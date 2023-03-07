Weaver.CharacterLoom = (function() {

  // Replaces token placeholders in the form of:
  //   {{actor::character.name}}
  //
  function findValue(actor, token, context) {
    if (token == "name") { return actor.getName(); }
    if (token == "firstName") { return actor.getFirstName(); }
    if (token == "firstName's") { return EnglishHelper.possessive(actor.getFirstName()); }

    return Weaver.error(`Bad character token(${token})`);
  }

  return { findValue };

})();