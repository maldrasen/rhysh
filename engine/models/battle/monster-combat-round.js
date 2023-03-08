global.MonsterCombatRound = class MonsterCombatRound {

  #monster;
  #target;
  #ability;
  #abilityTemplate;

  #combatResults;
  #triggers;

  constructor(monster) {
    this.#monster = monster;
    this.#target = CharacterLibrary.getCachedCharacter(monster.getTarget());
    this.#combatResults = [];
    this.#triggers = [];
  }

  getClassName() { return "MonsterCombatRound"; }
  getCombatResults() { return this.#combatResults; }
  getTriggers() { return this.#triggers; }
  clearTriggers() { this.#triggers = []; }

  getActor() { return this.#monster; }
  getActorType() { return 'Monster'; }
  getMonster() { return this.#monster; }
  getMonsterID() { return this.#monster.getID(); }

  getTarget() { return this.#target; }
  getTargetCode() { return this.#target.getCode(); }
  getTargetType() { return 'Character'; }

  getAbilityCode() { return this.#ability ? this.#ability.code : null; }
  getAbilityTemplate() { return this.#abilityTemplate; }

  addTrigger(trigger) {
    if (this.#triggers.indexOf(trigger) < 0) { this.#triggers.push(trigger); }
  }

  doMonsterAttack() {
    let result

    let weapons = this.lookupWeapons()
    let mainMode = (weapons.main) ? Random.from(weapons.main.modes) : null;
    let offMode = (weapons.off) ? Random.from(weapons.off.modes) : null;
    let hit = this.getMonster().getBaseHit();

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

    result.setWeaponBase(weapon);
    result.setWeaponMode(mode);
    result.chooseTargetSlot();

    if (result.isWeaponAttackMode()) {
      result.rollAttack(hitBonus);
      result.rollDamage(weapon.damage, this.getMonster().getAttributes().strModifier());
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
    let main;
    let off;

    if (this.getMonster().getMainHand()) {
      main = WeaponDictionary.lookup(this.getMonster().getMainHand());
    }
    if (this.getMonster().getOffHand()) {
      try {
        off = WeaponDictionary.lookup(this.getMonster().getOffHand());
      } catch(error) {
        off = null;
      }
    }

    return { main:main, off:off };
  }

  // TODO: Some abilities won't have a target.
  // TODO: Some abilities won't roll to hit.
  // TODO: Handle different template type: attack, hold, coup-de-grace.
  doMonsterAbility(ability) {
    this.#ability = ability;
    this.#abilityTemplate = AbilityDictionary.lookup(ability.code);

    this.#monster.useAbility(ability.code);

    let result = new CombatResult(this);
    result.chooseTargetSlot(this.#abilityTemplate.targetSlot);
    result.rollAttack(this.#ability.hit);
    result.rollDamage(this.#ability.damage);
    result.updateCondition();
    result.updateStatus();
    result.selectStory();
    result.commitDamage();

    this.#combatResults.push(result);
    this.checkCondition();
  }

  checkCondition() {
    let condition = this.#target.getCondition();
    if (this.getTargetCode() == 'Main') {
      if (condition.hasCondition('fainted')) { this.addTrigger('main-character-fainted'); }
      if (condition.hasCondition('dead')) { this.addTrigger('main-character-killed'); }
    }
  }

  pack() {
    let packed = {
      monsterID: this.#monster.getID(),
      results: this.#combatResults.map(combatResult => { return combatResult.pack(); }),
    };

    if (this.#ability) { packed.ability = this.#ability.code; }
    if (this.#target) { packed.target = this.#target.getCode(); }
    if (this.#triggers) { packed.triggers = this.#triggers; }

    return packed;
  }
}
