Weaver.CharacterLoom = (function() {

  // Replaces token placeholders in the form of:
  //   {{actor::character.name}}
  //
  function findValue(actor, token, context) {

    // Names
    if (token == "name")   { return actor.getStoryName(); }
    if (token == "Name")   { return TextHelper.titlecase(actor.getStoryName()); }
    if (token == "name's") { return EnglishHelper.possessive(actor.getStoryName()); }
    if (token == "Name's") { return EnglishHelper.possessive(TextHelper.titlecase(actor.getStoryName())); }

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