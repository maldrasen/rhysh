global.CombatResult = class CombatResult {

  #combatRound;
  #targetSlot;
  #scrutinizer;

  #weapon;
  #weaponTypeCode;
  #weaponMode;

  #attackRoll;
  #attackBonus;
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

    this.#scrutinizer = new Scrutinizer(new Context({
      combatResult: this,
      combatRound: this.#combatRound,
      actor: this.getActor(),
      target: this.getTarget(),
    }));
  }

  getActor() { return this.#combatRound.getActor(); }
  getTarget() { return this.#combatRound.getTarget(); }
  getAbility() { return this.#combatRound.getAbility(); }

  getTargetSlot() { return this.#targetSlot; }
  setTargetSlot(slot) { this.#targetSlot = slot; }
  getScrutinizer() { return this.#scrutinizer; }

  getWeapon() { return this.#weapon; }
  setWeapon(weapon) {
    this.#weapon = weapon;
    this.setWeaponTypeCode(weapon.getWeaponTypeCode());
  }
  setWeaponTypeCode(code) {
    WeaponType.lookup(code);
    this.#weaponTypeCode = code;
  }

  getWeaponMode() { return this.#weaponMode; }
  setWeaponMode(mode) { this.#weaponMode = mode; }
  isWeaponAttackMode() {
    return (this.#weaponMode) ? ([_parry,_riposte,_entangle].indexOf(this.#weaponMode) < 0) : false;
  }

  getAttackRoll() { return this.#attackRoll; }
  getAttackBonus() { return this.#attackBonus; }
  getAttackResult() { return this.#attackResult; }
  getAttackDamage() { return this.#attackDamage; }

  getStory() { return this.#story; }
  setStory(story) { this.#story = story; }

  isConditionChanged() { return this.#conditionChanges.length > 0; }
  getConditionChanges() { return this.#conditionChanges; }
  addConditionChange(change) { this.#conditionChanges.push(change); }

  isStatusChanged() { return this.#statusChanges.length > 0; }
  getStatusChanges() { return this.#statusChanges; }
  addStatusChange(change) { this.#statusChanges.push(change); }

  isSuccess() { return [_hit,_criticalHit].indexOf(this.#attackResult) >= 0; }
  isFailure() { return [_miss,_criticalMiss].indexOf(this.#attackResult) >= 0; }
  isHit() { return this.#attackResult == _hit; }
  isMiss() { return this.#attackResult == _miss; }
  isCriticalHit() { return this.#attackResult == _criticalHit; }
  isCriticalMiss() { return this.#attackResult == _criticalMiss; }

  chooseTargetSlot(slot) {
    let target = this.getTarget();

    if (slot != null) {
      this.#targetSlot = slot; return;
    }
    if (target.classname == _monsterActor) {
      this.#targetSlot = Random.fromFrequencyMap(target.getBody().getSlots());
    }
    if (target.classname == _characterActor) {
      this.#targetSlot = Random.fromFrequencyMap(MonsterBodyPlan.lookup('humanoid').slots);
    }
  }

  // Make an attack and determine the result. Hit bonus is 0 by default and
  // only applies to some abilities.
  rollAttack(hitBonus=0) {
    let targetArmorClass = this.getTarget().getArmorClass(this.#targetSlot);
    let modeBonus = this.#weaponMode ? WeaponModes[this.#weaponMode].hit : 0;
    let attributeBonus = this.getAttributeBonus();
    let magicalBonus = this.getMagicalBonus()

    this.#attackRoll = Random.rollDice({ d:20 });
    this.#attackBonus = hitBonus + modeBonus + attributeBonus + magicalBonus + this.getActor().getBaseHit();

    if (this.#attackRoll == 1)  { this.#attackResult = _criticalMiss; return; }
    if (this.#attackRoll == 20) { this.#attackResult = _criticalHit;  return; }

    this.#attackResult = (this.#attackRoll + this.#attackBonus >= targetArmorClass) ? _hit : _miss;
  }

  getMagicalBonus() {
    return this.#weapon ? this.#weapon.getMagicalBonus() : 0;
  }

  // If the character is attacking with a weapon then that weapon governs what
  // attribute is used for the attack bonus. If the monster is using an attack
  // ability it uses the ability's range to determine if it's a strength or a
  // dexterity based attack. The actual range doesn't matter, it's the range on
  // the ability, so that if a monster in close range attacks with a ranged
  // attack they still use their dex bonus. If that's insufficient I could
  // optionally add an attribute property to the ability that takes precedence
  // over the range.
  getAttributeBonus() {
    let attributes = this.getActor().getAttributes();

    if (this.#weaponTypeCode) {
      let weaponType = WeaponType.lookup(this.#weaponTypeCode);
      return attributes.getModifier(weaponType.attribute);
    }

    let ability = this.getAbility();
    if (ability && ability.type == _attack) {
      let attribute = (ability.range == _long) ? _dex : _str;
      return attributes.getModifier(attribute);
    }

    return 0;
  }

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

  useWeapon() {
    if (this.#weaponMode == _parry) {
      this.getActor().getCondition().setStatus(_defensive);
      this.setStory({ text:`{{A::Name}} parries with {{A::his}} {{A::weapon.main-hand.name}}.` })
      return;
    }

    if (this.#weaponMode == _riposte) {
      this.getActor().getCondition().setStatus(_riposte);
      this.setStory({ text:`{{A::Name}} readies {{A::his}} {{A::weapon.main-hand.name}} for a counter attack.` })
      return;
    }

    throw `TODO: Implement ${this.#weaponMode} weapon mode.`
  }

  updateCondition() {
    let ability = this.getAbility();

    if (ability.setCondition && this.isValidWhen(ability.setCondition.when)) {
      this.addConditionChange({ on:ability.setCondition.on, set:ability.setCondition.condition });

      if (ability.setCondition.on == _self) {
        this.getActor().getCondition().setCondition(ability.setCondition.condition);
      }
      if (ability.setCondition.on == _single) {
        this.getTarget().getCondition().setCondition(ability.setCondition.condition);
      }
    }
  }

  updateStatus() {
    let ability = this.getAbility();

    if (ability.addStatus && this.isValidWhen(ability.addStatus.when)) {
      this.addStatusChange({ on:ability.addStatus.on, add:ability.addStatus.status });

      if (ability.addStatus.on == _self) {
        return this.getActor().getCondition().setStatus(ability.addStatus.status, ability.addStatus.duration);
      }
      if (ability.addStatus.on == _single) {
        return this.getTarget().getCondition().setStatus(ability.addStatus.status, ability.addStatus.duration);
      }
      throw `TODO: Handle ability.addStatus.on=${ability.addStatus.on}`
    }
  }

  isValidWhen(when) {
    if (when == _always)  { return true; }
    if (when == _success) { return this.isSuccess(); }
    if (then == _failure) { return this.isFailure(); }
  }

  selectStory() {
    let ability = this.getAbility();

    if (ability.storyTeller) {
      throw `TODO: Implement Story Tellers.`;
    }

    let validStories = [];

    ability.stories.forEach(story => {
      if (this.#scrutinizer.meetsRequirements(story.when)) {
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
    if (this.#weaponTypeCode) { packed.weaponTypeCode = this.#weaponTypeCode; }
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
