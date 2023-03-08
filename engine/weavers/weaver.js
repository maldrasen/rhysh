global.Weaver = (function() {

  // The weave function takes a string and recursivly itterates over it,
  // looking for {{ templates }} to replace with actual values. The context
  // defines things like which actors are in which position and so forth. If
  // for instance you're having a conversation between three prople the player
  // may be {{P}}, while the other two actors might be {{C}} and {{D}}.
  function weave(text, context) {
    if (text == null) { return ''; }

    var working = true;

    while(working) {
      var actorMatch = text.match(/{{([^}]+)::([^}]+)}}/);
      var utilityMatch = text.match(/{{([^}]+)\|([^}]+)}}/);
      var shortcutMatch = text.match(/{{(he|him|his)}}/i);
      var simpleMatch = text.match(/{{([^}]+)}}/);

      if (actorMatch) {
        text = text.replace(actorMatch[0], actorValue(actorMatch[1].trim(), actorMatch[2].trim(), context));
      } else if (utilityMatch) {
        text = text.replace(utilityMatch[0], utilityValue(utilityMatch[1].trim(), utilityMatch[2].trim(), context));
      } else if (shortcutMatch) {
        text = text.replace(shortcutMatch[0], shortcutValue(shortcutMatch[1].trim(), context));
      } else if (simpleMatch) {
        text = text.replace(simpleMatch[0], simpleValue(simpleMatch[1].trim()));
      } else {
        working = false;
      }
    }

    return text.replace(/\s+/g,' ');
  }

  // The actor tokens have the form {{X::key}} where X is the actor key in the
  // context.
  function actorValue(subject, token, context) {
    let actor = context.get(subject);

    if (actor == null) {
      if (subject == 'P') { actir = CharacterLibrary.getMainCharacter(); }
      if (subject == 'T') { actor = context.get('target'); }
      if (subject == 'A') { actor = context.get('actor'); }
    }

    if (actor == null) { throw `Cannot determine actor.` }

    if (token.startsWith('balls'))   { return Weaver.BallsLoom.findValue(actor, token, context);   }
    if (token.startsWith('body'))    { return Weaver.BodyLoom.findValue(actor, token, context);    }
    if (token.startsWith('cock'))    { return Weaver.CockLoom.findValue(actor, token, context);    }
    if (token.startsWith('nipples')) { return Weaver.NipplesLoom.findValue(actor, token, context); }
    if (token.startsWith('species')) { return Weaver.SpeciesLoom.findValue(actor, token, context); }
    if (token.startsWith('tits'))    { return Weaver.TitsLoom.findValue(actor, token, context);    }
    if (token.startsWith('weapon'))  { return Weaver.WeaponLoom.findValue(actor, token, context);  }

    return Weaver.CharacterLoom.findValue(actor, token, context);
  }

  // The utility looms have the form {{utility|arguments}}
  function utilityValue(utility, argument, context) {
    if (utility.startsWith('battle')) { return Weaver.BattleLoom.findValue(argument, context); }

    return error(`Bad Utility Token(${utility}|${argument})`);
  }

  // Find a simple loom matches a single word and shouldn't have to rely on
  // anything in the context.
  function simpleValue(token) {
    if (token == 'ballsack')  { return Random.from(['ballsack','ballsack','scrotum']); }
    if (token == 'cock')      { return Random.from(['cock','cock','dick']); }
    if (token == 'pussy')     { return Random.from(['pussy','pussy','cunt']); }
    if (token == 'sheath')    { return Random.from(['sheath','cocksheath']); }
    if (token == 'testicles') { return Random.from(['testicles','balls']); }
    if (token == 'tit')       { return Random.from(['breast','tit']); }
    if (token == 'tits')      { return Random.from(['breasts','tits']); }
    if (token == 'throb')     { return Random.from(['throb','pulse']); }
    if (token == 'throbbing') { return Random.from(['throbbing','pulsing']); }
    if (token == 'wide')      { return Random.from(['wide','thick']); }

    return error(`Bad Simple Token(${token})`);
  }

  function error(message) {
    return `<span class='weaver-error error'>Error(${message})</span>`;
  }

  return { weave, error };

})();
