global.ConditionStoryTeller = (function() {

  function tellConditionChangeStory(options) {
    return '(condition change story)';
  }

  return { tellConditionChangeStory };

})();


    // if (conditionChange.on == _self) {
    //   if (conditionChange.set == _prone) {
    //     text = `{{A::Name}} falls prone.`
    //   }

    //   // No need to mention holds as that would be redundant.
    //   if (conditionChange.set == _holdingLegs) { return null; }
    //   if (conditionChange.set == _holdingArms) { return null; }
    // }

    // if (text == null) {
    //   throw `TODO: Render this condition ${conditionChange.on}:${conditionChange.set}`;
    // }
