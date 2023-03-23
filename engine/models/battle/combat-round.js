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
  hasResult() { return this.#result.hasAttackEvents() || this.#result.getActionStory() != null; }

  execute() {
    // TODO: If all monsters are dead then we do nothing.

    new InterruptComputer(this).checkForInterrupt();
    new TargetComputer(this).updateTarget();

    if (this.#action.isNothing()) { return; }
    if (this.#action.isAttack()) { return this.doAttack(); }
    if (this.#action.isAbility()) { return this.doAbility(); }
    throw `Unhandled action type: ${this.#action.getActionType()}`;
  }

  // === Ability Round =========================================================
  // TODO: Some abilities won't have a target.
  // TODO: Some abilities won't roll to hit.
  // TODO: Handle different ability types: attack, hold, coup-de-grace.

  doAbility() {
    const ability = this.getAction().getAbility();

    if (ability.type == _attack) { return this.doAttackAbility(); }

    throw `TODO: Execute ability type ${ability.type}`;
  }

  doAttackAbility() {
    const action = this.getAction();
    const actor = this.getActor();
    const ability = action.getAbility();
    const abilityLevel = action.getAbilityLevel();

    const attackEvent = new AttackEvent({
      ability: ability,
      abilityLevel: abilityLevel,
      targetSlot: (ability.targetSlot || this.chooseTargetSlot()),
    });

    const context = this.getResult().getContext();
          context.set('attackEvent',attackEvent);

    attackEvent.setActionStory(AbilityStoryTeller.tellActionStory({
      context: context,
      ability: ability,
      abilityLevel: abilityLevel,
    }));

    this.rollAttack((ability.hitBonus || 0) + actor.getBaseHit(), attackEvent);
    this.rollDamage(attackEvent);
    this.updateCondition(attackEvent);
    this.updateStatus(attackEvent);
    this.commitDamage(attackEvent);
    this.checkCondition(attackEvent);

    attackEvent.setResultStory(AbilityStoryTeller.tellResultStory({
      context: context,
      ability: ability,
      abilityLevel: abilityLevel,
      attackEvent: attackEvent,
    }));

    actor.useAbility(ability.code, attackEvent);

    this.getResult().addAttackEvent(attackEvent);
  }

  // === Atack Round ===========================================================

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
    const context = this.getResult().getContext();

    const event = new AttackEvent({
      weapon: weapon,
      weaponMode: mode,
      targetSlot: this.chooseTargetSlot(),
    });

    event.setActionStory(WeaponAttackStoryTeller.tellActionStory({
      context: context,
      weapon: weapon,
      mode: mode,
    }));

    this.rollAttack(currentHit, event);
    this.rollDamage(event);
    this.commitDamage(event);
    this.checkCondition(event);

    event.setResultStory(WeaponAttackStoryTeller.tellResultStory({
      context: context,
      attackEvent: event,
    }));

    this.getResult().addAttackEvent(event);
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

  isWeaponAttackMode(mode) {
    return (mode) ? ([_block,_parry,_riposte,_entangle].indexOf(mode) < 0) : false;
  }

  // === Shared ================================================================

  chooseTargetSlot() {
    let target = this.getTarget();
    if (target.classname == _monsterActor) {
      return Random.fromFrequencyMap(target.getBody().getSlots());
    }
    if (target.classname == _characterActor) {
      return Random.fromFrequencyMap(MonsterBodyPlan.lookup('humanoid').slots);
    }
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
    let ability = attackEvent.getAbility();
    let weapon = attackEvent.getWeapon();

    if (weapon) {
      return attributes.getModifier(weapon.getWeaponType().attribute);
    }

    if (ability) {
      return attributes.getModifier(ability.range == _long ? _dex : _str)
    }

    return 0;
  }

  // TODO: Apply critical miss penaltys.
  // TODO: attackEvent.getAbilityLevel() will sometimes modify ability damage.
  rollDamage(attackEvent, bonusDamage=0) {
    if (attackEvent.isCriticalMiss()) { return; }
    if (attackEvent.isMiss()) { return; }

    let damage;
    if (attackEvent.getWeapon()) { damage = attackEvent.getWeapon().getDamage(); }
    if (attackEvent.getAbility()) { damage = attackEvent.getAbility().damage; }
    if (damage == null) { return; }

    let rawDamage = Random.rollDice(damage);
    let critMultiplier = 2;

    if (attackEvent.isCriticalHit()) {
      attackEvent.setAttackDamage(Math.floor(rawDamage * critMultiplier) + bonusDamage);
    }
    if (attackEvent.isHit()) {
      attackEvent.setAttackDamage(rawDamage + bonusDamage);
    }
  }

  commitDamage(attackEvent) {
    if (attackEvent.getAttackDamage() > 0) {
      this.getTarget().doDamage(attackEvent.getAttackDamage());
    }
  }

  updateCondition(attackEvent) {
    const ability = attackEvent.getAbility();
    let changed;

    if (ability.setCondition && attackEvent.isValidWhen(ability.setCondition.when)) {

      if (ability.setCondition.on == _self) {
        changed = this.getActor();
        changed.getCondition().setCondition(ability.setCondition.condition);
      }
      if (ability.setCondition.on == _single) {
        changed = this.getTarget();
        changed.getCondition().setCondition(ability.setCondition.condition);
      }

      const conditionChange = {
        condition: ability.setCondition.condition,
        story: ConditionStoryTeller.tellConditionChangeStory({
          changed: changed,
          context: this.getResult().getContext(),
        }),
      };

      this.setChangedActor(conditionChange, changed)
      attackEvent.addConditionChange(conditionChange);
    }
  }

  updateStatus(attackEvent) {
    const ability = attackEvent.getAbility();
    let changed;

    if (ability.addStatus && attackEvent.isValidWhen(ability.addStatus.when)) {

      if (ability.addStatus.on == _self) {
        changed = this.getActor();
        changed.getCondition().setStatus(ability.addStatus.status, ability.addStatus.duration);
      }
      if (ability.addStatus.on == _single) {
        changed = this.getTarget();
        changed.getCondition().setStatus(ability.addStatus.status, ability.addStatus.duration);
      }

      const statusChange = {
        status: ability.addStatus.status,
        story: StatusStoryTeller.tellStatusChangeStory({
          changed: changed,
          context: this.getResult().getContext(),
        }),
      };

      this.setChangedActor(statusChange, changed)
      attackEvent.addStatusChange(statusChange);
    }
  }

  setChangedActor(change, changed) {
    if (changed.classname == _monsterActor) {
      change.changedType = _monsterActor;
      change.changedID = changed.getID();
    }
    if (changed.classname == _characterActor) {
      change.changedType = _characterActor;
      change.changedCode = changed.getCode();
      change.changedPosition = changed.getPosition();
    }
  }

  checkCondition(attackEvent) {
    let target = this.getTarget();
    let condition = target.getCondition();

    if (condition.hasConditionInCategory(_fallen)) { attackEvent.setTargetFallen(); }
  }

  // ===========================================================================

  pack() {
    return {
      action: this.#action.pack(),
      result: this.#result.pack(),
    };
  }

}