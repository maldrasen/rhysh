global.AttackWithWeapon = (function() {

  function execute(combatRound) {
    const action = combatRound.getAction();
    const actor = action.getActor();
    const mainHand = actor.getMainHand();
    const offHand = actor.getOffHand();
    const offHandPenalty = actor.getOffHandAttackPenalty();

    let hit = actor.getBaseHit();
    let mainMode = action.getMainMode();
    let offMode = action.getOffMode();

    if (mainHand && mainMode == null) { mainMode = mainHand.getRandomMode() }
    if (offHand && offMode == null) { offMode = offHand.getRandomMode() }

    const mainIsAttack = isWeaponAttackMode(mainMode)
    const offIsAttack = isWeaponAttackMode(offMode)

    if (mainMode && mainIsAttack == false) { useEquipment(combatRound, mainHand, mainMode); }
    if (offMode && offIsAttack == false) { useEquipment(combatRound, offHand, offMode); }

    while(hit >= 0 && combatRound.getResult().canContinueAttacking()) {
      if (mainIsAttack) { doSingleAttack(combatRound, hit, mainHand, mainMode); }
      if (offIsAttack) { doSingleAttack(combatRound, (hit + offHandPenalty), offHand, offMode); }
      hit = hit - 5;
    }
  }

  function doSingleAttack(combatRound, currentHit, weapon, mode) {
    const result = combatRound.getResult();
    const context = result.getContext();

    const event = new CombatEvent({
      weapon: weapon,
      weaponMode: mode,
      targetSlot: combatRound.chooseTargetSlot(),
    });

    event.setActionStory(WeaponAttackStoryTeller.tellActionStory({
      context: context,
      weapon: weapon,
      mode: mode,
    }));

    combatRound.rollAttack(currentHit, event);
    combatRound.rollDamage(event);
    combatRound.commitDamage(event);
    combatRound.checkCondition(event);

    event.setResultStory(WeaponAttackStoryTeller.tellResultStory({
      context: context,
      combatEvent: event,
    }));

    result.addCombatEvent(event);
  }

  function useEquipment(combatRount, equipment, mode) {
    if (mode == _block) { return; }

    if (mode == _parry) {
      combatRount.getActor().getCondition().setStatus(_defensive);
      combatRount.getResult().setActionStory(`{{A::Name}} parries with {{A::his}} {{A::weapon.main-hand.name}}.`);
      return;
    }

    if (mode == _riposte) {
      combatRount.getActor().getCondition().setStatus(_riposte);
      combatRount.getResult().setActionStory(`{{A::Name}} readies {{A::his}} {{A::weapon.main-hand.name}} for a
        counter attack.`);
      return;
    }

    throw `TODO: Implement using ${equipment.getName()} in ${mode} mode.`
  }

  function isWeaponAttackMode(mode) {
    return (mode) ? ([_block,_parry,_riposte,_entangle].indexOf(mode) < 0) : false;
  }

  return { execute };

})()