global.CentralScrutinizer = (function() {

  const registry = [
    //{pattern, checkFunction}...
  ]

  // The CentralScrutinizer is used to check the validity of an arbritray set
  // of requirements. The requires argument can be a string or an array of
  // strings. If the context is null a new context will be built by the
  // Scrutinizer. Requires can have the following forms:
  //
  //   single requirements:    'flag.cock=huge'
  //   and requirements:       ['flag.tits=huge','flag.cock=huge']
  //   or requirements:        [{ or:['flag.anus=huge','flag.pussy=huge'] }]
  //   and/or requirements:    ['flag.cock=huge',{ or:['flag.anus=huge','flag.pussy=huge'] }]
  //
  // There's no further nesting of more ands inside of ors though. This isn't
  // recursive, and I don't think we'll get to that level of complexity with
  // requirement checking, or if we do there should be some other way to
  // implement what's needed.
  //
  // Specific requirement formats are explained in their respective
  // scrutinizers, though for the most part they're very simple and
  // self-explanitory.
  async function meetsRequirements(requires, context, extra) {
    if (requires == null || requires.length == 0) { return true; }
    if (context == null) { context = new Context(); }
    if (extra == null) { extra = {}; }

    let requirements = (typeof requires == "string") ? [requires] : requires;
    return (await Promise.all((requirements).map(async requirement => {
      return requirement.or ?
        (await checkOrRequirements(requirement.or, context, extra)):
        (await meetsRequirement(requirement, context, extra));
    }))).indexOf(false) < 0;
  }

  async function checkOrRequirements(requirements, context, extra) {
    return (await Promise.all((requirements).map(async requirement => {
      return await meetsRequirement(requirement, context, extra);
    }))).indexOf(true) >= 0;
  }

  async function meetsRequirement(requirement, context, extra) {
    for (let i=0; i<registry.length; i++) {
      if (requirement.match(registry[i].pattern)) {
        return registry[i].checkFunction(requirement, context, extra)
      }
    }

    throw `Unknown Requirement - ${requirement}`;
  }

  // This function is used by any requirement check that needs to compare two
  // values. A RegEx like ([^<>=]+)(<|<=|=|>=|>)([^<>=]+) can be used to get
  // two values on either side of a comparison operation.
  function checkComparisonOperation(leftValue,operation,rightValue) {
    if (operation == '<=') { return parseInt(leftValue) <= parseInt(rightValue); }
    if (operation == '>=') { return parseInt(leftValue) >= parseInt(rightValue); }
    if (operation == '<')  { return parseInt(leftValue) < parseInt(rightValue); }
    if (operation == '>')  { return parseInt(leftValue) > parseInt(rightValue); }
    return leftValue == rightValue;
  }

  return {
    meetsRequirements,
    checkComparisonOperation
  };

})();
