Weaver.CharacterLoom = (function() {

  // Replaces token placeholders in the form of:
  //   {{actor::character.name}}
  //
  function findValue(actor, token, context) {

    // Character names
    if (token == "firstName") { return actor.getFirstName(); }
    if (token == "firstName's") { return EnglishHelper.possessive(actor.getFirstName()); }

    // Monster names
    if (token == "TheMonster") { return `The ${actor.getName()}`; }
    if (token == "theMonster") { return `the ${actor.getName()}`; }

    // Species
    if (token == "anElf") { return EnglishHelper.a_an(actor.getSpecies().name); }
    if (token == "AnElf") { return EnglishHelper.A_An(actor.getSpecies().name); }

    // Pronouns
    if (token == "his")  { return PronounHelper.his(actor.getSex());  }
    if (token == "him")  { return PronounHelper.him(actor.getSex());  }
    if (token == "he")   { return PronounHelper.he(actor.getSex());   }
    if (token == "hers") { return PronounHelper.hers(actor.getSex()); }
    if (token == "His")  { return PronounHelper.His(actor.getSex());  }
    if (token == "Him")  { return PronounHelper.Him(actor.getSex());  }
    if (token == "He")   { return PronounHelper.He(actor.getSex());   }
    if (token == "Hers") { return PronounHelper.Hers(actor.getSex()); }

    return Weaver.error(`Bad Character Token(${token})`);
  }

  return { findValue };

})();