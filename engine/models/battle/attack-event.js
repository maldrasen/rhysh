global.AttackEvent = class AttackEvent {

  #targetSlot;
  #weapon;
  #weaponMode;

  #actionStory;

  constructor(options) {
    this.#targetSlot = options.targetSlot;
    this.#weapon = options.weapon;
    this.#weaponMode = options.weaponMode;
  }

  getTargetSlot() { return this.#targetSlot; }
  getWeaponMode() { return this.#weaponMode; }
  getWeapon() { return this.#weapon; }

  getActionStory() { return this.#actionStory; }
  setActionStory(story) { this.#actionStory = story; }

  pack() {
    return {
      targetSlot: this.#targetSlot,
      weapon: this.#weapon,
      weaponMode: this.#weaponMode,
      actionStory: this.#actionStory,
    };
  }

}
