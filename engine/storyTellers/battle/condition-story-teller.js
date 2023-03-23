global.ConditionStoryTeller = (function() {

  function tellConditionChangeStory(options) {
    const condition = options.ability.setCondition.condition
    const context = options.context;
          context.set('C',options.changed);

    if (condition == _prone) { return Weaver.weave(`{{C::Name}} falls prone.`,context); }

    // No need to mention holds from the holder side as that would be redundant.
    if (condition == _holdingLegs) { return null; }
    if (condition == _holdingArms) { return null; }

    throw `TODO: Story for condition:${condition}`;
  }

  return { tellConditionChangeStory };

})();
