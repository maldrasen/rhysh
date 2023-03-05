global.BattleScrutinizer = (function() {

  function check(requirement, context) {
    let parts = requirement.match(/^(monster|target)\.(condition|status)(=)(.*)/);
    if (parts == null) {
      throw `Unparsable battle requirement: ${requirement}`;
    }

    let actor = context.get(parts[1] == 'target' ? 'target' : 'monster');
    let property = parts[2];
    let operator = parts[3];
    let value = parts[4];

    if (property == 'condition') { return checkCondition(actor,value); }
    if (property == 'status') { return checkStatus(actor,value); }

    throw `Unrecognized property in ${requirement}`;
  }

  function checkCondition(actor, value) {
    return actor.hasCondition(value);
  }

  function checkStatus(actor, value) {
    return actor.hasStatus(value);
  }

  return { check };

})();


