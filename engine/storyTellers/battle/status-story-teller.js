global.StatusStoryTeller = (function() {

  function tellStatusChangeStory(options) {
    return '(status change story)';
  }

  return { tellStatusChangeStory };

})();

    // let text;
    // let severity;

    // if (statusChange.on == _single) {
    //   if (statusChange.add == _boundLegs) {
    //     text = `{{T::name's}} legs are bound.`;
    //     severity = 'bad';
    //   }
    //   if (statusChange.add == _boundArms) {
    //     text = `{{T::name's}} arms are bound.`;
    //     severity = 'bad';
    //   }
    // }

    // if (text == null) {
    //   throw `TODO: Render this condition ${statusChange.on}:${statusChange.add}`;
    // }

    // return {
    //   type: _statusChange,
    //   text: Weaver.weave(text, context),
    //   severity: severity
    // };
