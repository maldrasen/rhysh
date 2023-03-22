global.AttackEvent = class AttackEvent {

  #targetSlot;
  #weapon;
  #weaponMode;

  #attackRoll;
  #attackBonus;
  #attackResult;
  #attackDamage;

  #actionStory;
  #resultStory;

  #isTargetFallen;

  constructor(options) {
    this.#targetSlot = options.targetSlot;
    this.#weapon = options.weapon;
    this.#weaponMode = options.weaponMode;

    this.#isTargetFallen = false;
  }

  getTargetSlot() { return this.#targetSlot; }
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

  pack() {
    let packed = {
      targetSlot: this.#targetSlot,
      weapon: this.#weapon.getName(),
      weaponMode: this.#weaponMode,
    };

    if (this.#attackResult) { packed.attackResult = this.#attackResult; }
    if (this.#attackRoll)   { packed.attackRoll = this.#attackRoll; }
    if (this.#attackBonus)  { packed.attackBonus = this.#attackBonus; }
    if (this.#attackDamage) { packed.attackDamage = this.#attackDamage; }
    if (this.#actionStory)  { packed.actionStory = this.#actionStory; }
    if (this.#resultStory)  { packed.resultStory = this.#resultStory; }

    if (this.isTargetFallen()) { packed.isTargetFallen = true; }

    return packed;
  }

}
