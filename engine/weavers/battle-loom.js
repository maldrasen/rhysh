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
    return Random.from({
      head:  ['head','head','face','neck','throat'],
      chest: ['chest','chest','breast','torso','back'],
      hands: ['arm','arm','hand','wrist','shoulder'],
      feet:  ['foot','ankle'],
      legs:  ['leg','leg','knee','ass','crotch','thigh','loin','hip'],
    }[context.get('combatResult').getTargetSlot()]);
  }

  return { findValue };

})();