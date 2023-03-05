global.AbilityDictionary = (function() {
  const dictionary = {};

  function register(code, data) {
    if (data.range == null && shouldHaveRangeSet(data.type)) { data.range = 'close'; }
    dictionary[code] = { code, ...data };
    validate(code);
  }

  function lookup(code) {
    if (dictionary[code] == null) { throw `Unknown Ability (${code})` }
    return dictionary[code];
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
      if (ability.targetSlot) { validateTargetSlot(ability); }
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
        'targetSlot',
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

  function validateTargetSlot(ability) {
    Validate.isIn(ability.targetSlot, ['head','chest','legs','hands','feet']);
  }

  // Validate both the condition and the condition target (on value).
  function validateSetCondition(ability) {
    ConditionDictionary.lookup(ability.setCondition.condition);
    Validate.isIn(ability.setCondition.on, ['self','target']);
    Validate.isIn(ability.setCondition.when, ['always','success','failure']);
  }

  // Validate both the status and the status target (on value).
  function validateAddStatus(ability) {
    StatusDictionary.lookup(ability.addStatus.status);
    Validate.isIn(ability.addStatus.on, [
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

    (ability.stories||[]).forEach(story => validateStory(story));
  }

  // Stories are going to be a common structure. May need to move this function
  // into a separate story validator. The ability stories may have a slightly
  // different structure though with the attacks, hits, and misses and such.
  function validateStory(story) {
    const validKeys = ['when','chance','bonusDamage','attempt','hit','miss','text'];

    Object.keys(story).forEach(key => {
      if (ArrayHelper.contains(validKeys,key) == false) {
        throw `Invalid Story Key: ${key}`
      }
    });
  }

  return {
    register,
    lookup,
  };

})();
