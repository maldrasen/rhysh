global.Weaver = (function() {

  const Looms = { actor:[], utility:[], shortcut:[], simple:[] };

  // Register a new loom.
  //
  // actor      The character module adds most of these looms that have the form
  //            {{X::key}} where X is the actor key in the context. Because this
  //            only matches a pattern to a weaver it's safe to include here in
  //            the core module.
  //
  // utility    These looms have the form {{utility|arguments}} to allow for
  //            function call like string replacement
  //
  // simple     Simple looms have a single key in the form {{key}}

  function registerLoom(type, pattern, replaceFunction) {
    Looms[type].push({ pattern, replaceFunction });
  }

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
    for (let i=0; i<Looms.actor.length; i++) {
      if (token.match(Looms.actor[i].pattern)) {
        return Looms.actor[i].replaceFunction(subject, token, context);
      }
    }

    return error(`BadToken(${subject}::${token})`);
  }

  // Find a utility loom that matches the token and replace it.
  function utilityValue(utility, argument, context) {
    for (let i=0; i<Looms.utility.length; i++) {
      if (utility.match(Looms.utility[i].pattern)) {
        return Looms.utility[i].replaceFunction(utility, argument, context);
      }
    }

    return error(`BadToken(${utility}|${argument})`);
  }

  // Find a simple loom that matches the token and replace it.
  function simpleValue(token) {
    for (let i=0; i<Looms.simple.length; i++) {
      if (token.match(Looms.simple[i].pattern)) {
        return Looms.simple[i].replaceFunction();
      }
    }

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
    const keys = Object.keys(context.getActors());
    const first = context.getActors()[keys[0]];

    if (keys.length == 1) { return first.character.gender[token]; }
    if (context.actors['C']) { return context.get('C').character.gender[token]; }
    throw `Pronoun shortcuts can only be used when there is only one actor in a scene, or when there is a 'C' actor.`;
  }

  function error(message) {
    return `<span class='weaver-error error'>Error(${message})</span>`;
  }

  return { registerLoom, weave, error };

})();
