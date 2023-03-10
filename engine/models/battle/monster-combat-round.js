global.MonsterCombatRound = class MonsterCombatRound {

  #actor;
  #action;
  #combatResults;
  #triggers;

  constructor(actor, action) {
    this.#actor = actor;
    this.#action = action;
    this.#combatResults = [];
    this.#triggers = [];
  }

  execute() {
    if (this.#action.isNothing()) { return; }
    if (this.#action.isAttack()) { return this.doAttack(); }
    if (this.#action.isAbility()) { return this.doAbility(); }
    throw `Unhandled action type: ${this.#action.getActionType()}`;
  }

  getActor() { return this.#actor; }
  getActorType() { return _monster; }

  getCombatResults() { return this.#combatResults; }
  getTriggers() { return this.#triggers; }
  clearTriggers() { this.#triggers = []; }

  getCombatAction() { return this.#action; }
  getTarget() { return this.#action.getTarget(); }
  getTargetType() { return this.#action.getTargetType(); }
  getTargetIdentifier() { return this.#action.getTargetIdentifier(); }
  getAbilityCode() { return this.#action.getAbilityCode(); }
  getAbilityTemplate() { return this.#action.getAbilityTemplate(); }

  addTrigger(trigger) {
    if (this.#triggers.indexOf(trigger) < 0) { this.#triggers.push(trigger); }
  }

  doAttack() {
    let result

    let weapons = this.lookupWeapons()
    let mainMode = (weapons.main) ? Random.from(weapons.main.modes) : null;
    let offMode = (weapons.off) ? Random.from(weapons.off.modes) : null;
    let hit = this.getActor().getBaseHit();

    while(hit > 0) {
      if (mainMode) {
        result = this.doSingleAttack(hit, weapons.main, mainMode);
      }
      if (offMode && hit-2 >= 0) {
        result = this.doSingleAttack(hit-2, weapons.off, offMode);
      }

      hit = (result.isCriticalMiss()) ? -1 : hit - 5;
      this.#combatResults.push(result);
    }
  }

  doSingleAttack(hitBonus, weapon, mode) {
    let result = new CombatResult(this);

    result.setWeaponCode(weapon.code);
    result.setWeaponMode(mode);
    result.chooseTargetSlot();

    if (result.isWeaponAttackMode()) {
      result.rollAttack(hitBonus);
      result.rollDamage(weapon.damage, this.getActor().getAttributes().strModifier());
      result.setStory(new WeaponAttackStoryTeller(result).tellStory());
    } else {
      result.useWeapon();
    }

    result.commitDamage();
    this.checkCondition();
    return result;
  }

  // If the off hand weapon is null, it's probably a shield or something that
  // we don't need to worry about.
  lookupWeapons() {
    let mainCode = this.getActor().getMainHandCode()
    let offCode = this.getActor().getOffHandCode()
    let offHand

    if (offCode) {
      try { offHand = WeaponDictionary.lookup(); } catch(error) {}
    }

    return {
      main: (mainCode ? WeaponDictionary.lookup(mainCode) : null),
      off: offHand
    };
  }

  // TODO: Some abilities won't have a target.
  // TODO: Some abilities won't roll to hit.
  // TODO: Handle different template type: attack, hold, coup-de-grace.
  doAbility() {
    let ability = this.getAbilityCode();
    let template = this.getAbilityTemplate();
    let details = this.getActor().findAbility(ability);

    this.getActor().useAbility(ability);

    let result = new CombatResult(this);
    result.chooseTargetSlot(template.targetSlot);
    result.rollAttack(details.hit);
    result.rollDamage(details.damage);
    result.updateCondition();
    result.updateStatus();
    result.selectStory();
    result.commitDamage();

    this.#combatResults.push(result);
    this.checkCondition();
  }

  checkCondition() {
    let target = this.getTarget();
    let condition = target.getCondition();

    if (target.getCode() == 'Main') {
      if (condition.hasCondition('fainted')) { this.addTrigger('main-character-fainted'); }
      if (condition.hasCondition('dead')) { this.addTrigger('main-character-killed'); }
    }
  }

  pack() {
    let packed = {
      monsterID: this.getActor().getID(),
      action: this.#action.pack(),
      results: this.#combatResults.map(combatResult => { return combatResult.pack(); }),
    };

    if (this.#triggers) { packed.triggers = this.#triggers; }

    return packed;
  }
}
