global.Ability = (function() {
  const AbilityDictionary = {};

  function register(code, data) {
    AbilityDictionary[code] = { code, ...data };
    validate(code);
  }

  function lookup(code) {
    if (AbilityDictionary[code] == null) { throw `Unknown Ability (${code})` }
    return AbilityDictionary[code];
  }

  function all() {
    return { ...AbilityDictionary };
  }

  function validate(code) {
    let ability = lookup(code);

    // Validate that we're only setting values that we know about.
    Object.keys(ability).forEach(key => {
      Validate.isIn(key, [
        'code',
        'type',
        'range',
        'cooldown',
        'requires',
        'selfSetState',
        'targetAddStatus',
        'stories',
        'storyTeller'
      ]);
    });

    // An ability has to have at least a type set. The other validations mostly
    // depend on the ability type.
    Validate.isIn(ability.type, ['attack','grapple','hold','coup-de-grace']);

    // Some ability types need to have a range set, but if there's no range set
    // we can assume that they're close range attacks by default.
    if (ArrayHelper.contains(['attack','grapple','coup-de-grace'],ability.type)) {
      if (ability.range == null) { ability.range = 'close'; }
    }
    if (ability.range) {
      Validate.isIn(ability.range, ['close','extended','long']);
    }

    // TODO: Validate States and Statuses when we have a better idea of what
    //       they all are.
    //
    // states: holding-legs holding-arms
    // statuses: bound-legs bound-arms

    let both = ability.stories == null && ability.storyTeller == null;
    let none = ability.stories != null && ability.storyTeller != null;
    if (both || none) { throw `Ability should have either a story teller or a list of stories.`; }
  }


  return {
    register,
    lookup,
    all,
  };

})();
