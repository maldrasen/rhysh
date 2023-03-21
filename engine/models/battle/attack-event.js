global.AttackEvent = class AttackEvent {

  #targetSlot;
  #weapon;
  #weaponMode;

  constructor(options) {
    this.#targetSlot = options.targetSlot;
    this.#weapon = options.weapon;
    this.#weaponMode = options.weaponMode;

  }

  getWeaponMode() { return this.#weaponMode; }
  setWeaponMode(mode) { this.#weaponMode = mode; }

  getWeapon() { return this.#weapon; }
  setWeapon(weapon) { this.#weapon = weapon; }

  pack() {
    return {
      targetSlot: this.#targetSlot,
      weapon: this.#weapon,
      weaponMode: this.#weaponMode,
    };
  }

}
