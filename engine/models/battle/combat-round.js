global.CombatRound = class CombatRound {

  #action;
  #result;

  constructor(actor, action) {
    this.#action = action;
    this.#result = new CombatResult(this);
  }

  getAction() { return this.#action; }
  getActor() { return this.#action.getActor(); }
  getTarget() { return this.#action.getTarget(); }
  getResult() { return this.#result; }

  execute() {
    // TODO: If all monsters are dead then we do nothing.

    new InterruptComputer(this).checkForInterrupt();
    new TargetComputer(this).updateTarget();

    if (this.#action.isNothing()) { return; }
    if (this.#action.isAttack()) { return this.doAttack(); }
    if (this.#action.isAbility()) { return this.doAbility(); }
    throw `Unhandled action type: ${this.#action.getActionType()}`;
  }

  doAttack() {
    const action = this.getAction();
    const actor = action.getActor();
    const mainHand = actor.getMainHand();
    const offHand = actor.getOffHand();
    const offHandPenalty = actor.getOffHandAttackPenalty();

    let hit = actor.getBaseHit();
    let mainMode = action.getMainMode();
    let offMode = action.getOffMode();

    if (mainHand && mainMode == null) { mainMode = mainHand.getRandomMode() }
    if (offHand && offMode == null) { offMode = offHand.getRandomMode() }

    const mainIsAttack = this.isWeaponAttackMode(mainMode)
    const offIsAttack = this.isWeaponAttackMode(offMode)

    if (mainMode && mainIsAttack == false) { this.useEquipment(mainHand, mainMode); }
    if (offMode && offIsAttack == false) { this.useEquipment(offHand, offMode); }

    while(hit >= 0 && this.#result.canContinueAttacking()) {
      if (mainIsAttack) { this.doSingleAttack(hit, mainHand, mainMode); }
      if (offIsAttack) { this.doSingleAttack(hit + offHandPenalty, offHand, offMode); }
      hit = hit - 5;
    }
  }

  doSingleAttack(currentHit, weapon, mode) {

    const event = new AttackEvent({
      weapon: weapon,
      weaponMode: mode,
      targetSlot: this.chooseTargetSlot(),
    })

    console.log("Event:",event.pack());

    //   result.rollAttack(currentHit);
    //   result.rollDamage(weapon.getDamage(), this.getActor().getAttributes().strModifier());
    //   result.setStory(new WeaponAttackStoryTeller(result).tellStory());

    // result.commitDamage();
    // this.checkCondition();
    // return result;
  }

  useEquipment(equipment, mode) {
    if (mode == _block) { return; }

    if (mode == _parry) {
      this.getActor().getCondition().setStatus(_defensive);
      this.getResult().setActionStory(`{{A::Name}} parries with {{A::his}} {{A::weapon.main-hand.name}}.`);
      return;
    }

    if (mode == _riposte) {
      this.getActor().getCondition().setStatus(_riposte);
      this.getResult().setActionStory(`{{A::Name}} readies {{A::his}} {{A::weapon.main-hand.name}} for a
        counter attack.`);
      return;
    }

    throw `TODO: Implement using ${equipment.getName()} in ${mode} mode.`
  }

  doAbility() {

  }

  isWeaponAttackMode(mode) {
    return (mode) ? ([_block,_parry,_riposte,_entangle].indexOf(mode) < 0) : false;
  }

  chooseTargetSlot() {
    let target = this.getTarget();
    if (target.classname == _monsterActor) {
      return Random.fromFrequencyMap(target.getBody().getSlots());
    }
    if (target.classname == _characterActor) {
      return Random.fromFrequencyMap(MonsterBodyPlan.lookup('humanoid').slots);
    }
  }

  // ===========================================================================

  pack() {
    return {
      action: this.#action.pack(),
      result: this.#result.pack(),
    };
  }

}