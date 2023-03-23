global.CombatEvent = class CombatEvent {

  #targetSlot;
  #ability;
  #abilityLevel;
  #weapon;
  #weaponMode;

  #attackRoll;
  #attackBonus;
  #attackResult;
  #attackDamage;

  #conditionChanges;
  #statusChanges;

  #actionStory;
  #resultStory;

  #isTargetFallen;

  constructor(options) {
    this.#targetSlot = options.targetSlot;
    this.#ability = options.ability;
    this.#abilityLevel = options.abilityLevel;
    this.#weapon = options.weapon;
    this.#weaponMode = options.weaponMode;

    this.#conditionChanges = [];
    this.#statusChanges = [];

    this.#isTargetFallen = false;
  }

  getTargetSlot() { return this.#targetSlot; }
  getAbility() { return this.#ability; }
  getAbilityLevel() { return this.#abilityLevel; }
  getWeaponMode() { return this.#weaponMode; }
  getWeapon() { return this.#weapon; }

  getAttackRoll() { return this.#attackRoll; }
  setAttackRoll(roll) { this.#attackRoll = roll; }

  getAttackBonus() { return this.#attackBonus; }
  setAttackBonus(bonus) { this.#attackBonus = bonus; }
  getAttackTotal() { return this.#attackRoll + this.#attackBonus; }

  getAttackResult() { return this.#attackResult; }
  setAttackResult(result) { this.#attackResult = result; }
  isSuccess() { return [_hit,_criticalHit].indexOf(this.#attackResult) >= 0; }
  isFailure() { return [_miss,_criticalMiss].indexOf(this.#attackResult) >= 0; }
  isHit() { return this.#attackResult == _hit; }
  isMiss() { return this.#attackResult == _miss; }
  isCriticalHit() { return this.#attackResult == _criticalHit; }
  isCriticalMiss() { return this.#attackResult == _criticalMiss; }

  getAttackDamage() { return this.#attackDamage; }
  setAttackDamage(damage) { this.#attackDamage = damage; }

  getActionStory() { return this.#actionStory; }
  setActionStory(story) { this.#actionStory = story; }

  getResultStory() { return this.#resultStory; }
  setResultStory(story) { this.#resultStory = story; }

  setTargetFallen() { this.#isTargetFallen = true; }
  isTargetFallen() { return this.#isTargetFallen; }

  // === Status & Conditions ===================================================

  isConditionChanged() { return this.#conditionChanges.length > 0; }
  getConditionChanges() { return this.#conditionChanges; }
  addConditionChange(change) { this.#conditionChanges.push(change); }

  isStatusChanged() { return this.#statusChanges.length > 0; }
  getStatusChanges() { return this.#statusChanges; }
  addStatusChange(change) { this.#statusChanges.push(change); }

  isValidWhen(when) {
    if (when == _always)  { return true; }
    if (when == _success) { return this.isSuccess(); }
    if (then == _failure) { return this.isFailure(); }
  }

  // ===========================================================================

  pack() {
    let packed = {};

    if (this.#targetSlot)   { packed.targetSlot = this.#targetSlot;     }
    if (this.#ability)      { packed.ability = this.#ability.code;      }
    if (this.#abilityLevel) { packed.abilityLevel = this.#abilityLevel; }
    if (this.#weapon)       { packed.weapon = this.#weapon.getName();   }
    if (this.#weaponMode)   { packed.weaponMode = this.#weaponMode;     }
    if (this.#attackResult) { packed.attackResult = this.#attackResult; }
    if (this.#attackRoll)   { packed.attackRoll = this.#attackRoll;     }
    if (this.#attackBonus)  { packed.attackBonus = this.#attackBonus;   }
    if (this.#attackDamage) { packed.attackDamage = this.#attackDamage; }
    if (this.#actionStory)  { packed.actionStory = this.#actionStory;   }
    if (this.#resultStory)  { packed.resultStory = this.#resultStory;   }

    if (this.#conditionChanges.length > 0) { packed.conditionChanges = this.#conditionChanges; }
    if (this.#statusChanges.length > 0)    { packed.statusChanges = this.#statusChanges;       }

    if (this.isTargetFallen()) { packed.isTargetFallen = true; }

    return packed;
  }

}
