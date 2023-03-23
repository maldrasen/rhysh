global.StatusStoryTeller = (function() {

  function tellStatusChangeStory(options) {
    const status = options.ability.addStatus.status;
    const context = options.context;
          context.set('C',options.changed);

    if (status == _boundLegs) { return Weaver.weave(`{{C::name's}} legs are bound.`,context); }
    if (status == _boundArms) { return Weaver.weave(`{{C::name's}} arms are bound.`,context); }

    throw `TODO: Story for status:${status}`;
  }

  return { tellStatusChangeStory };

})();
