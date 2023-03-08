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

  doMonsterAttack() {
    let result = new CombatResult(this);
    result.chooseTargetSlot();
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
      if (condition.hasCondition('fainted')) { this.#triggers.push('main-character-fainted'); }
      if (condition.hasCondition('dead')) { this.#triggers.push('main-character-killed'); }
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
