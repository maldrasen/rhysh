global.CombatResult = class CombatResult {

  #combatRound;
  #targetSlot;

  #weapon;
  #weaponBase;
  #weaponMode;

  #attackRoll;
  #attackResult;
  #attackDamage;
  #story;

  #conditionChanges;
  #statusChanges;

  constructor(round) {
    this.#combatRound = round
    this.#attackDamage = 0;
    this.#conditionChanges = [];
    this.#statusChanges = [];
  }

  getActor() { return this.#combatRound.getActor(); }
  getTarget() { return this.#combatRound.getTarget(); }
  getAbilityCode() { return this.#combatRound.getAbilityCode(); }
  getAbilityTemplate() { return this.#combatRound.getAbilityTemplate(); }

  getTargetSlot() { return this.#targetSlot; }
  setTargetSlot(slot) { this.#targetSlot = slot; }
  chooseTargetSlot(slot) { this.#targetSlot = slot || BattleEngine.randomSlot(); }

  getWeaponBase() { return this.#weaponBase; }
  setWeaponBase(base) { this.#weaponBase = base; }
  setWeapon(weapon) {
    this.#weapon = weapon;
    this.#weaponBase = weapon.getBase();
  }

  getWeaponMode() { return this.#weaponMode; }
  setWeaponMode(mode) { this.#weaponMode = mode; }
  isWeaponAttackMode() {
    return (this.#weaponMode) ? (['parry','riposte','entangle'].indexOf(this.#weaponMode) < 0) : false;
  }

  getAttackRoll() { return this.#attackRoll; }
  setAttackRoll(roll) { this.#attackRoll = roll; }

  getAttackResult() { return this.#attackResult; }
  setAttackResult(result) { this.#attackResult = result; }

  getAttackDamage() { return this.#attackDamage; }
  setAttackDamage(damage) { this.#attackDamage = damage; }

  getStory() { return this.#story; }
  setStory(story) { this.#story = story; }

  isConditionChanged() { return this.#conditionChanges.length > 0; }
  getConditionChanges() { return this.#conditionChanges; }
  addConditionChange(change) { this.#conditionChanges.push(change); }

  isStatusChanged() { return this.#statusChanges.length > 0; }
  getStatusChanges() { return this.#statusChanges; }
  addStatusChange(change) { this.#statusChanges.push(change); }

  isSuccess() { return ['hit','critical-hit'].indexOf(this.#attackResult) >= 0; }
  isFailure() { return ['miss','critical-miss'].indexOf(this.#attackResult) >= 0; }
  isHit() { return this.#attackResult == 'hit'; }
  isMiss() { return this.#attackResult == 'miss'; }
  isCriticalHit() { return this.#attackResult == 'critical-hit'; }
  isCriticalMiss() { return this.#attackResult == 'critical-miss'; }

  // Make an attack and determine the result. Hit bonus is 0 by default and
  // only applies to some abilities.
  rollAttack(hitBonus=0) {
    let modeHit = this.#weaponMode ? WeaponModeDictionary.lookup(this.#weaponMode).hit : 0;

    this.#attackRoll = Random.rollDice({ d:20 })

    if (this.#attackRoll == 1)  { this.#attackResult = 'critical-miss'; return; }
    if (this.#attackRoll == 20) { this.#attackResult = 'critical-hit';  return; }

    let targetArmorClass = this.getTarget().getArmorClass(this.#targetSlot);
    let adjustedHit = this.#attackRoll + this.getActor().getBaseHit() + hitBonus + modeHit;

    this.#attackResult = (adjustedHit >= targetArmorClass) ? 'hit' : 'miss';
  }

  // TODO: Adjust critical hit ranges and damage multipliers.
  rollDamage(damage, bonusDamage=0) {
    if (this.#attackResult == 'hit') { this.#attackDamage = this.getDamage(damage,bonusDamage); }
    if (this.#attackResult == 'critical-hit') { this.#attackDamage = this.getDamage(damage,bonusDamage,2); }

    if (this.#attackResult == 'critical-miss') {
      // TODO: Determine critical failure result for monster. We could do a few
      //       interesting things here. Add a prone condition, have them hit an
      //       ally instead.
    }
  }

  getDamage(damage, bonusDamage=0, multiplier=1) {
    return (damage == null) ? 0 : Math.floor(Random.rollDice(damage) * multiplier) + bonusDamage;
  }

  useWeapon() {
    if (this.#weaponMode == 'parry') {
      this.getActor().getCondition().setStatus('defensive');
      this.setStory({ text:`{{A::Name}} parries with {{A::his}} {{A::weapon.main-hand.name}}.` })
      return;
    }

    if (this.#weaponMode == 'riposte') {
      this.getActor().getCondition().setStatus('riposte');
      this.setStory({ text:`{{A::Name}} readies {{A::his}} {{A::weapon.main-hand.name}} for a counter attack.` })
      return;
    }

    throw `TODO: Implement ${this.#weaponMode} weapon mode.`
  }

  updateCondition() {
    let template = this.getAbilityTemplate();

    if (template.setCondition && this.isValidWhen(template.setCondition.when)) {
      this.addConditionChange({ on:template.setCondition.on, set:template.setCondition.condition });

      if (template.setCondition.on == 'self') {
        this.getActor().getCondition().setCondition(template.setCondition.condition);
      }
      if (template.setCondition.on == 'target') {
        this.getTarget().getCondition().setCondition(template.setCondition.condition);
      }
    }
  }

  updateStatus() {
    let template = this.getAbilityTemplate();

    if (template.addStatus && this.isValidWhen(template.addStatus.when)) {
      this.addStatusChange({ on:template.addStatus.on, add:template.addStatus.status });

      if (template.addStatus.on == 'self') {
        this.getActor().getCondition().setStatus(template.addStatus.status, template.addStatus.duration);
      }
      if (template.addStatus.on == 'target') {
        this.getTarget().getCondition().setStatus(template.addStatus.status, template.addStatus.duration);
      }
      if (template.addStatus.on == 'all-ally') { throw `TODO: Implement all-ally target for status effects.`}
      if (template.addStatus.on == 'all-enemy') { throw `TODO: Implement all-enemy target for status effects.` }
      if (template.addStatus.on == 'ally') { throw `TODO: Implement random ally target for status effects.` }
      if (template.addStatus.on == 'rank') { throw `TODO: Implement rank target for status effects.` }
    }
  }

  isValidWhen(when) {
    if (when == 'always')  { return true; }
    if (when == 'success') { return this.isSuccess(); }
    if (then == 'failure') { return this.isFailure(); }
  }

  selectStory() {
    let template = this.getAbilityTemplate();

    if (template.story) {
      this.#story = template.story; return;
    }

    if (template.storyTeller) {
      throw `TODO: Implement Story Tellers.`;
    }

    let validStories = [];

    let scrutinizer = new Scrutinizer(new Context({
      combatResult: this,
      combatRound: this.#combatRound,
      actor: this.getActor(),
      target: this.getTarget(),
    }));

    template.stories.forEach(story => {
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
    this.#attackDamage += (this.#story.bonusDamage || 0);
  }

  commitDamage() {
    if (this.#attackDamage > 0) {
      this.getTarget().doDamage(this.#attackDamage);
    }
  }

  pack() {
    let packed = {};

    if (this.#targetSlot) { packed.targetSlot = this.#targetSlot; }
    if (this.#weaponBase) { packed.weaponCode = this.#weaponBase.code; }
    if (this.#weaponMode) { packed.weaponMode = this.#weaponMode; }
    if (this.#attackRoll) { packed.attackRoll = this.#attackRoll; }
    if (this.#attackResult) { packed.attackResult = this.#attackResult; }
    if (this.#attackDamage) { packed.attackDamage = this.#attackDamage; }
    if (this.#story) { packed.story = this.#story; }
    if (this.#conditionChanges.length > 0) { packed.conditionChanges = this.#conditionChanges;}
    if (this.#statusChanges.length > 0) { packed.statusChanges = this.#statusChanges; }

    return packed;
  }

}
