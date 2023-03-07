global.Weaver = (function() {

  // actor      The character module adds most of these looms that have the form
  //            {{X::key}} where X is the actor key in the context. Because this
  //            only matches a pattern to a weaver it's safe to include here in
  //            the core module.
  //
  // utility    These looms have the form {{utility|arguments}} to allow for
  //            function call like string replacement
  //
  // simple     Simple looms have a single key in the form {{key}}
  const Looms = { actor:[], utility:[], shortcut:[], simple:[] };

  // The weave function takes a string and recursivly itterates over it,
  // looking for {{ templates }} to replace with actual values. The context
  // defines things like which actors are in which position and so forth. If
  // for instance you're having a conversation between three prople the player
  // may be {{P}}, while the other two actors might be {{C}} and {{D}}.
  //
  // Everything that the weaver uses should already be in the context, that way
  // this function can remain synchronous.
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

  // Find an actor loom that matches the token and replace it.
  function actorValue(subject, token, context) {
    let actor = context.get(subject);

    if (actor == null) {
      if (subject == 'T') { actor = context.get('target'); }
      if (subject == 'M') { actor = context.get('monster'); }
    }

    if (actor == null) { throw `Cannot determine actor.` }

    // if (token.startsWith('balls'))     { return Weaver.BallsLoom.findValue(actor, token, context); }
    // if (token.startsWith('body'))      { return Weaver.BodyLoom.findValue(actor, token, context); }
    // if (token.startsWith('cock'))      { return Weaver.CockLoom.findValue(actor, token, context); }
    // if (token.startsWith('gender'))    { return Weaver.GenderLoom.findValue(actor, token, context); }
    // if (token.startsWith('nipples'))   { return Weaver.NipplesLoom.findValue(actor, token, context); }
    // if (token.startsWith('species'))   { return Weaver.SpeciesLoom.findValue(actor, token, context); }
    // if (token.startsWith('tits'))      { return Weaver.TitsLoom.findValue(actor, token, context); }

    if (token.startsWith('weapon')) { return Weaver.WeaponLoom.findValue(actor, token, context); }

    return Weaver.CharacterLoom.findValue(actor, token, context);
  }

  // Find a utility loom that matches the token and replace it.
  function utilityValue(utility, argument, context) {
    // if (utility.startsWith('flag')) { return Weaver.FlagLoom.findValue(argument, context); }
    // if (utility.startsWith('game')) { return Weaver.GameLoom.findValue(argument, context); }
    // if (utility.match(/^[rR]andom/)) { return Weaver.RandomLoom.findValue(utility, argument); }
    // if (utility.match(/^(inch|foot|feet|yard|yards)/)) { return Weaver.MeasurementLoom.findValue(utility, argument); }
    return error(`BadToken(${utility}|${argument})`);
  }

  // Find a simple loom that matches the token and replace it.
  function simpleValue(token) {
    // if (token == 'ballsack')  { return Random.from(['ballsack','ballsack','scrotum']); }
    // if (token == 'maleDemon') { return Random.from(['Abaddon','Baal','Baphomet','Behemoth','Lucifer','Maldrasen','Mephistopheles','Satan','Slaanesh']); }
    // if (token == 'cock')      { return Random.from(['cock','cock','dick']); }
    // if (token == 'pussy')     { return Random.from(['pussy','pussy','cunt']); }
    // if (token == 'sheath')    { return Random.from(['sheath','cocksheath']); }
    // if (token == 'testicles') { return Random.from(['testicles','balls']); }
    // if (token == 'tit')       { return Random.from(['breast','tit']); }
    // if (token == 'tits')      { return Random.from(['breasts','tits']); }
    // if (token == 'throb')     { return Random.from(['throb','pulse']); }
    // if (token == 'throbbing') { return Random.from(['throbbing','pulsing']); }
    // if (token == 'wide')      { return Random.from(['wide','thick']); }
    // if (token == 'unholy')    { return Random.from(['unholy','demonic','infernal','satanic','corrupt','blasphemous','cursed','accursed']); }

    return error(`BadToken(${token})`);
  }

  // The pronoun shortcuts are a little magical. They only work when there is a
  // a single actor or a 'C' actor in the scene. When that's the case we don't
  // need to specify which actor is being talked about. We only do this for
  // pronouns though because they're by far the most used tokens. And {{him}}
  // is much easier to type and read than {{C::gender.him}}.
  //
  // It's fine keeping this in the core module as well. It's just pattern
  // matching and navigating down into objects, so there are no dependencies
  // on the character classes to worry about.
  function shortcutValue(token, context) {
    // TODO: This will need redone I think...

    // const keys = Object.keys(context.getActors());
    // const first = context.getActors()[keys[0]];

    // if (keys.length == 1) { return first.character.gender[token]; }
    // if (context.actors['C']) { return context.get('C').character.gender[token]; }
    // throw `Pronoun shortcuts can only be used when there is only one actor in a scene, or when there is a 'C' actor.`;
  }

  function error(message) {
    return `<span class='weaver-error error'>Error(${message})</span>`;
  }

  return { weave, error };

})();
