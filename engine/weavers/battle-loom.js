Weaver.BattleLoom = (function() {

  // Replaces token placeholders in the form of:
  //   {{actor::weapon.main-hand.name}}
  //   {{actor::weapon.off-hand.name}}
  //
  function findValue(value, context) {
    if (value == 'target-slot-word') { return getTargetSlotWord(context); }

    return Weaver.error(`Bad Battle Token(${token})`);
  }

  function getTargetSlotWord(context) {
    let combatEvent = context.get('combatEvent');

    if (combatEvent == null) {
      throw `Context should have contained a combatEvent.`
    }

    return Random.from({
      head:  ['head','head','face','neck','throat'],
      chest: ['chest','chest','torso','back'],
      hands: ['arm','arm','hand','wrist','shoulder'],
      feet:  ['foot','ankle'],
      legs:  ['leg','leg','knee','thigh','hip'],
      // Misc monster slots
      back:  ['back'],
      claws: ['claw'],
    }[combatEvent.getTargetSlot()]);
  }

  return { findValue };

})();
