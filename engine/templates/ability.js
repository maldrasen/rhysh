global.Ability = (function() {
  const AbilityDictionary = {};

  function register(code, data) {
    if (data.range == null && shouldHaveRangeSet(data.type)) { data.range = 'close'; }

    AbilityDictionary[code] = { code, ...data };

    validate(code);
  }

  function lookup(code) {
    if (AbilityDictionary[code] == null) { throw `Unknown Ability (${code})` }
    return AbilityDictionary[code];
  }

  // Ability types that use the attack range. We keep track of these because if
  // a range isn't specified we use close range by default. This isn't a normal
  // default value though because some abilities don't have ranges.
  function shouldHaveRangeSet(type) {
    return  ArrayHelper.contains(['attack','grapple','coup-de-grace'], type);
  }

  // === Validations ===========================================================

  function validate(code) {
    try {
      let ability = lookup(code);

      validateKeys(ability);
      validateType(ability);
      validateStories(ability);

      if (ability.range) { validateRange(ability); }
      if (ability.setCondition) { validateSetCondition(ability); }
      if (ability.addStatus) { validateAddStatus(ability); }
    } catch(error) {
      console.error(`Ability(${code}) is invalid: `,error);
    }
  }

  // We want to validate that we're only setting values that we know about.
  function validateKeys(ability) {
    Object.keys(ability).forEach(key => {
      Validate.isIn(key, [
        'code',
        'type',
        'range',
        'cooldown',
        'requires',
        'setCondition',
        'addStatus',
        'stories',
        'storyTeller'
      ]);
    });
  }

  function validateType(ability) {
    Validate.isIn(ability.type, ['attack','grapple','hold','coup-de-grace']);
  }

  function validateRange(ability) {
    Validate.isIn(ability.range, ['close','extended','long']);
  }

  // Validate both the condition and the condition target (on value).
  function validateSetCondition(ability) {
    Condition.lookup(ability.setCondition.condition);
    Validate.isIn(ability.setCondition.on, ['self','target'])
  }

  // Validate both the status and the status target (on value).
  function validateAddStatus(ability) {
    Status.lookup(ability.addStatus.status);
    Validate.isIn(ability.setCondition.on, [
      'all-ally',
      'all-enemy',
      'ally',
      'rank',
      'self',
      'target',
    ]);
  }

  function validateStories(ability) {
    let both = ability.stories == null && ability.storyTeller == null;
    let none = ability.stories != null && ability.storyTeller != null;
    if (both || none) { throw `Ability should have either a story teller or a list of stories.`; }
  }

  return {
    register,
    lookup,
  };

})();
