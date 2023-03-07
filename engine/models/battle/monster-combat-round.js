global.MonsterCombatRound = class MonsterCombatRound {

  #monster;
  #target;
  #targetSlot;
  #targetBeaten;

  #ability;
  #abilityTemplate;

  #attackRoll;
  #attackResult;
  #attackDamage;

  #setConditionOn;
  #setConditionCode;
  #addStatusOn;
  #addStatusCode;

  #story;

  constructor(monster) {
    this.#monster = monster;
    this.#target = CharacterLibrary.getCachedCharacter(monster.getTarget());
  }

  getClassName() { return "MonsterCombatRound"; }
  getMonster() { return this.#monster; }
  getMonsterID() { return this.#monster.getID(); }

  getTarget() { return this.#target; }
  getTargetCode() { return this.#target.getCode(); }
  getTargetSlot() { return this.#targetSlot; }
  getTargetBeaten() { return this.#targetBeaten; }

  getAttackRoll() { return this.#attackRoll; }
  getAttackResult() { return this.#attackResult; }
  getAttackDamage() { return this.#attackDamage; }

  getAbilityCode() { return this.#ability ? this.#ability.code : null; }
  getAbilityTemplate() { return this.#abilityTemplate; }

  isConditionSet() { return this.#setConditionCode != null; }
  getConditionSet() {
    return { code:this.#setConditionCode, on:this.#setConditionOn };
  }

  isStatusAdded() { return this.#addStatusCode != null; }
  getStatusAdded() {
    return { code:this.#addStatusCode, on:this.#addStatusOn };
  }

  isSuccess() { return ['hit','critical-hit'].indexOf(this.#attackResult) >= 0; }
  isFailure() { return ['miss','critical-miss'].indexOf(this.#attackResult) >= 0; }
  getStory() { return this.#story; }

  doMonsterAttack() {
    // console.log("...do attack");
  }

  // TODO: Some abilities won't have a target.
  // TODO: Some abilities won't roll to hit.
  // TODO: Handle different template type: attack, hold, coup-de-grace.
  doMonsterAbility(ability) {
    this.#ability = ability;
    this.#abilityTemplate = AbilityDictionary.lookup(ability.code);

    this.#monster.useAbility(ability.code);
    this.#targetSlot = this.#abilityTemplate.targetSlot || BattleEngine.randomSlot();

    this.rollAttack(this.#ability.hit);
    this.rollDamage(this.#ability.damage);
    this.updateCondition();
    this.updateStatus();
    this.selectStory();

    if (this.#story.bonusDamage) {
      this.#target.doDamage(this.#story.bonusDamage);
    }

    this.checkCondition();
  }

  // Add the make an attack and determine the result. If targetSlot is
  // null a random slot will be picked. Hit bonus is 0 by default and only
  // applies to some abilities.
  rollAttack(hitBonus=0) {
    this.#attackRoll = Random.rollDice({ d:20 })

    if (this.#attackRoll == 1)  { this.#attackResult = 'critical-miss'; return; }
    if (this.#attackRoll == 20) { this.#attackResult = 'critical-hit';  return; }

    let targetArmorClass = this.#target.getArmorClass(this.#targetSlot);
    let adjustedHit = this.#attackRoll + this.#monster.getBaseHit() + hitBonus;

    this.#attackResult = (adjustedHit >= targetArmorClass) ? 'hit' : 'miss';
  }

  rollDamage(damage) {
    if (this.#attackResult == 'hit') { this.#attackDamage = this.getDamage(damage); }
    if (this.#attackResult == 'critical-hit') { this.#attackDamage = this.getDamage(damage,2); }

    if (this.#attackResult == 'critical-miss') {
      // TODO: Determine critical failure result for monster. We could do a few
      //       interesting things here. Add a prone condition, have them hit an
      //       ally instead.
    }

    if (this.#attackDamage && this.#attackDamage > 0) {
      this.#target.doDamage(this.#attackDamage);
    }
  }

  getDamage(damage, multiplier=1) {
    return (damage == null) ? 0 : Math.floor(Random.rollDice(damage) * multiplier);
  }

  // Set condition of monster or target.
  updateCondition() {
    let temp = this.#abilityTemplate;

    if (temp.setCondition && this.isValidWhen(temp.setCondition.when)) {
      this.#setConditionOn = temp.setCondition.on;
      this.#setConditionCode = temp.setCondition.condition;

      if (temp.setCondition.on == 'self') {
        this.#monster.getCondition().setCondition(temp.setCondition.condition);
      }
      if (temp.setCondition.on == 'target') {
        this.#target.getCondition().setCondition(temp.setCondition.condition);
      }
    }
  }

  // Add status to monster or target.
  updateStatus() {
    let temp = this.#abilityTemplate;

    if (temp.addStatus && this.isValidWhen(temp.addStatus.when)) {
      this.#addStatusOn = temp.addStatus.on;
      this.#addStatusCode = temp.addStatus.status;

      if (temp.addStatus.on == 'self') {
        this.#monster.getCondition().setStatus(temp.addStatus.status, temp.addStatus.duration);
      }
      if (temp.addStatus.on == 'target') {
        this.#target.getCondition().setStatus(temp.addStatus.status, temp.addStatus.duration);
      }
      if (temp.addStatus.on == 'all-ally') { throw `TODO: Implement all-ally target for status effects.`}
      if (temp.addStatus.on == 'all-enemy') { throw `TODO: Implement all-enemy target for status effects.` }
      if (temp.addStatus.on == 'ally') { throw `TODO: Implement random ally target for status effects.` }
      if (temp.addStatus.on == 'rank') { throw `TODO: Implement rank target for status effects.` }
    }
  }

  isValidWhen(when) {
    if (when == 'always')  { return true; }
    if (when == 'success') { return this.isSuccess(); }
    if (then == 'failure') { return this.isFailure(); }
  }

  // TODO: Some abilities should have a storyTeller rather than an array of
  //       possible stories.
  selectStory() {

    if (this.#abilityTemplate.story) {
      this.#story = this.#abilityTemplate.story; return;
    }

    if (this.#abilityTemplate.storyTeller) {
      throw `TODO: Implement Story Tellers.`;
    }

    let validStories = [];

    let scrutinizer = new Scrutinizer(new Context({
      round: this,
      monster: this.#monster,
      target: this.#target,
    }));

    this.#abilityTemplate.stories.forEach(story => {
      if (scrutinizer.meetsRequirements(story.when)) {
        if ((story.chance) ? (Random.roll(100) < story.chance) : true) {
          validStories.push(story);
        }
      }
    });

    if (validStories.length == 0) {
      console.error('There are no valid stories for a MonsterCombatRound with the following state:')
      console.error(this.pack());
      throw `No valid stories`;
    }

    this.#story = Random.from(validStories);
  }

  checkCondition() {
    let condition = this.#target.getCondition();
    if (condition.hasCondition('fainted')) { this.#targetBeaten = 'fainted'; }
    if (condition.hasCondition('dead')) { this.#targetBeaten = 'dead'; }
  }

  pack() {
    let packed = {};

    if (this.#ability)          { packed.ability = this.#ability.code;          }
    if (this.#target)           { packed.target = this.#target.getCode();       }
    if (this.#attackRoll)       { packed.attackRoll = this.#attackRoll;         }
    if (this.#attackResult)     { packed.attackResult = this.#attackResult;     }
    if (this.#attackDamage)     { packed.attackDamage = this.#attackDamage;     }
    if (this.#setConditionCode) { packed.conditionSet = this.getConditionSet(); }
    if (this.#addStatusCode)    { packed.statusAdded = this.getStatusAdded();   }
    if (this.#targetBeaten)     { packed.targetBeaten = this.#targetBeaten;     }
    if (this.#story)            { packed.story = this.#story;                   }

    return packed;
  }
}