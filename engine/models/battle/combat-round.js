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
  hasResult() { return this.#result.hasCombatEvents() || this.#result.getActionStory() != null; }

  execute() {
    // TODO: If all monsters are dead then we do nothing.

    new InterruptComputer(this).checkForInterrupt();
    new TargetComputer(this).updateTarget();

    if (this.#action.isNothing()) { return; }
    if (this.#action.isAttack()) { return AttackWithWeapon.execute(this); }
    if (this.#action.isAbility()) { return this.executeAbility(); }

    throw `Unhandled action type: ${this.#action.getActionType()}`;
  }

  executeAbility() {
    const ability = this.getAction().getAbility();

    if (ability.type == _attack) { return AttackWithAbility.execute(this); }
    if (ability.type == _spell) {
      if (ability.spellType == _globalEffect) { return CastGlobalEffect.execute(this); }
      if (ability.spellType == _groupEffect) { return CastGroupEffect.execute(this); }
      if (ability.spellType == _singleEffect) { return CastSingleEffect.execute(this); }
    }

    throw `TODO: Execute ability type ${ability.type}`;
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
  rollAttack(currentHit, combatEvent) {
    const targetArmorClass = this.getTarget().getArmorClass(combatEvent.getTargetSlot());
    const modeBonus = this.getModeBonus(combatEvent);
    const attributeBonus = this.getAttributeBonus(combatEvent);
    const magicalBonus = this.getMagicalBonus(combatEvent);

    combatEvent.setAttackRoll(Random.rollDice({ d:20 }));
    combatEvent.setAttackBonus(currentHit + modeBonus + attributeBonus + magicalBonus);

    if (combatEvent.getAttackRoll() == 1)  { return combatEvent.setAttackResult(_criticalMiss); }
    if (combatEvent.getAttackRoll() == 20) { return combatEvent.setAttackResult(_criticalHit); }

    combatEvent.setAttackResult((combatEvent.getAttackTotal() >= targetArmorClass) ? _hit : _miss);
  }

  getModeBonus(combatEvent) {
    return combatEvent.getWeaponMode() ? WeaponModes[combatEvent.getWeaponMode()].hit : 0;
  }

  getMagicalBonus(combatEvent) {
    return combatEvent.getWeapon() ? combatEvent.getWeapon().getMagicalBonus() : 0;
  }

  // If the character is attacking with a weapon then that weapon governs what
  // attribute is used for the attack bonus. If the monster is using an attack
  // ability it uses the ability's range to determine if it's a strength or a
  // dexterity based attack. The actual range doesn't matter, it's the range on
  // the ability, so that if a monster in close range attacks with a ranged
  // attack they still use their dex bonus. If that's insufficient I could
  // optionally add an attribute property to the ability that takes precedence
  // over the range.
  getAttributeBonus(combatEvent) {
    let attributes = this.getActor().getAttributes();
    let ability = combatEvent.getAbility();
    let weapon = combatEvent.getWeapon();

    if (weapon) {
      return attributes.getModifier(weapon.getWeaponType().attribute);
    }

    if (ability) {
      return attributes.getModifier(ability.range == _long ? _dex : _str)
    }

    return 0;
  }

  // TODO: Apply critical miss penaltys.
  // TODO: combatEvent.getAbilityLevel() will sometimes modify ability damage.
  rollDamage(combatEvent, bonusDamage=0) {
    if (combatEvent.isCriticalMiss()) { return; }
    if (combatEvent.isMiss()) { return; }

    let damage;
    if (combatEvent.getWeapon()) { damage = combatEvent.getWeapon().getDamage(); }
    if (combatEvent.getAbility()) { damage = combatEvent.getAbility().damage; }
    if (damage == null) { return; }

    let rawDamage = Random.rollDice(damage);
    let critMultiplier = 2;

    if (combatEvent.isCriticalHit()) {
      combatEvent.setAttackDamage(Math.floor(rawDamage * critMultiplier) + bonusDamage);
    }
    if (combatEvent.isHit()) {
      combatEvent.setAttackDamage(rawDamage + bonusDamage);
    }
  }

  commitDamage(combatEvent) {
    if (combatEvent.getAttackDamage() > 0) {
      this.getTarget().doDamage(combatEvent.getAttackDamage());
    }
  }

  updateCondition(combatEvent) {
    const ability = combatEvent.getAbility();
    let changed;

    if (ability.setCondition && combatEvent.isValidWhen(ability.setCondition.when)) {

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
          ability: ability,
          changed: changed,
          context: this.getResult().getContext(),
        }),
      };

      this.setChangedActor(conditionChange, changed)
      combatEvent.addConditionChange(conditionChange);
    }
  }

  updateStatus(combatEvent) {
    const ability = combatEvent.getAbility();
    let changed;

    if (ability.addStatus && combatEvent.isValidWhen(ability.addStatus.when)) {

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
          ability: ability,
          changed: changed,
          context: this.getResult().getContext(),
        }),
      };

      this.setChangedActor(statusChange, changed)
      combatEvent.addStatusChange(statusChange);
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

  checkCondition(combatEvent) {
    let target = this.getTarget();
    let condition = target.getCondition();

    if (condition.hasConditionInCategory(_fallen)) { combatEvent.setTargetFallen(); }
  }

  // ===========================================================================

  pack() {
    return {
      action: this.#action.pack(),
      result: this.#result.pack(),
    };
  }

}