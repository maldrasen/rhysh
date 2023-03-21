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
    });

    event.setActionStory(WeaponAttackStoryTeller.tellActionStory({
      context: this.getResult().getContext(),
      weapon: weapon,
      mode: mode,
    }));

    this.rollAttack(currentHit, event);

    //   result.rollDamage(weapon.getDamage(), this.getActor().getAttributes().strModifier());
    //   result.setStory(new WeaponAttackStoryTeller(result).tellStory());

    // result.commitDamage();
    // this.checkCondition();
    // return result;
    console.log("Event:",event.pack());
  }

  // Make an attack and determine the result. The current hit property should
  // be the character's base hit but if this is a weapon attack it will be
  // reduced on subsequent attacks and has to be sent as a parameter.
  rollAttack(currentHit, attackEvent) {
    const targetArmorClass = this.getTarget().getArmorClass(attackEvent.getTargetSlot());
    const modeBonus = this.getModeBonus(attackEvent);
    const attributeBonus = this.getAttributeBonus(attackEvent);
    const magicalBonus = this.getMagicalBonus(attackEvent);

    attackEvent.setAttackRoll(Random.rollDice({ d:20 }));
    attackEvent.setAttackBonus(currentHit + modeBonus + attributeBonus + magicalBonus);

    if (attackEvent.getAttackRoll() == 1)  { return attackEvent.setAttackResult(_criticalMiss); }
    if (attackEvent.getAttackRoll() == 20) { return attackEvent.setAttackResult(_criticalHit); }

    attackEvent.setAttackResult((attackEvent.getAttackTotal() >= targetArmorClass) ? _hit : _miss);
  }

  getModeBonus(attackEvent) {
    return attackEvent.getWeaponMode() ? WeaponModes[attackEvent.getWeaponMode()].hit : 0;
  }

  getMagicalBonus(attackEvent) {
    return attackEvent.getWeapon() ? attackEvent.getWeapon().getMagicalBonus() : 0;
  }

  // If the character is attacking with a weapon then that weapon governs what
  // attribute is used for the attack bonus. If the monster is using an attack
  // ability it uses the ability's range to determine if it's a strength or a
  // dexterity based attack. The actual range doesn't matter, it's the range on
  // the ability, so that if a monster in close range attacks with a ranged
  // attack they still use their dex bonus. If that's insufficient I could
  // optionally add an attribute property to the ability that takes precedence
  // over the range.
  getAttributeBonus(attackEvent) {
    let attributes = this.getActor().getAttributes();
    let weapon = attackEvent.getWeapon();

    if (weapon) {
      return attributes.getModifier(weapon.getWeaponType().attribute);
    }

    // TODO Reimplement Ability attribute bonus
    // let ability = this.getAbility();
    // if (ability && ability.type == _attack) {
    //   let attribute = (ability.range == _long) ? _dex : _str;
    //   return attributes.getModifier(attribute);
    // }

    return 0;
  }

/*
  // TODO: Adjust critical hit ranges and damage multipliers.
  rollDamage(damage, bonusDamage=0) {
    if (this.isFailure()) { return; }
    if (damage == null) { return; }

    if (this.#attackResult == _hit) { this.#attackDamage = this.getDamage(damage,bonusDamage); }
    if (this.#attackResult == _criticalHit) { this.#attackDamage = this.getDamage(damage,bonusDamage,2); }

    if (this.#attackResult == _criticalMiss) {
      // TODO: Randomly determine critical failure result
    }
  }

  getDamage(damage, bonusDamage=0, multiplier=1) {
    return Math.floor(Random.rollDice(damage) * multiplier) + bonusDamage;;
  }
*/

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