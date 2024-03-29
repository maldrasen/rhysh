global.BattleScrutinizer = (function() {

  function check(requirement, context) {

    // This requirement checks a property of the attack used.
    let match = requirement.match(/attack\.(.*)/);
    if (match) { return checkAttackRequirement(match[1], context); }

    // This requirement checks a monster's or a target's status or condition.
    match = requirement.match(/^(monster|target)\.(condition|status)(=)(.*)/);
    if (match) { return checkConditionRequirement(match, context); }

    // This requirement checks some other property of the monster or the target.
    match = requirement.match(/^(monster|target)\.(.*)/);
    if (match) { return checkActorRequirement(match, context); }

    throw `Unrecognized Battle Requirement: ${requirement}`;
  }

  function checkAttackRequirement(value, context) {
    let match = value.match(/^hits-(.*)/);
    if (match) { return context.get('combatResult').getTargetSlot() == match[1]; }

    throw `Unrecognized Attack Requirement Value: ${value}`;
  }

  function checkConditionRequirement(parts, context) {
    let actor = context.get(parts[1] == 'target' ? 'target' : 'actor');
    let property = parts[2];
    let value = parts[4];

    if (actor == null) {
      throw `No actor in context at ${parts[1]}`;
    }

    if (property == 'condition') { return checkCondition(actor,value); }
    if (property == 'status') { return checkStatus(actor,value); }
  }

  function checkActorRequirement(parts, context) {
    let actor = context.get(parts[1] == 'target' ? 'target' : 'actor');
    let value = parts[2];

    if (value == 'exposed-cock') { return actor.isCockExposed(); }
    if (value == 'exposed-pussy') { return actor.isPussyExposed(); }
    if (value == 'exposed-tits') { return actor.areTitsExposed(); }

    if (value == 'has-cock') { return actor.hasCock(); }
    if (value == 'has-pussy') { return actor.hasPussy(); }
    if (value == 'has-tits') { return actor.hasTits(); }

    throw `Unrecognized Actor Requirement Value: ${value}`;
  }

  function checkCondition(actor, value) {
    return actor.hasCondition(value);
  }

  function checkStatus(actor, value) {
    return actor.hasStatus(value);
  }

  return { check };

})();


