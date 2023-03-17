global.Weapon = class Weapon {

  #id;
  #weaponType;
  #name;
  #equippedBy;

  constructor(code) {
    this.#weaponType = code;
    this.#name = WeaponType.lookup(code).name;
  }

  isWeapon() { return true; }
  getWeaponTypeCode() { return this.#weaponType; }
  getWeaponType() { return WeaponType.lookup(this.#weaponType); }
  getDamage() { return this.getWeaponType().damage; }
  getHands() { return this.getWeaponType().hands; }
  getModes() { return this.getWeaponType().modes; }
  rollDamage() { return Random.rollDice(this.getDamage()) }

  getID() { return this.#id; }
  setID(id) { this.#id = id; }

  getName() { return this.#name; }
  setName(name) { this.#name = name; }

  // === Equipment =============================================================

  getEquippedBy() { return { ...this.#equippedBy }; }

  setEquippedBy(character, slot) {
    if (slot == null) {
      throw `Determine slot from type?`
    }
    if (['mainHand','offHand'].indexOf(slot) < 0) {
      throw `Weapons can only be equipped in the main or off hand.`;
    }
    if (character.canEquip(this) == false) {
      throw `Character(${character.getCode()}) cannot equip Item(${id})`;
    }

    this.#equippedBy = { code:character.getCode(), slot:slot };
  }

  // === Persistance ===========================================================

  pack() {
    return {
      classname:  'Weapon',
      weaponType: this.#weaponType,
      id:         this.#id,
      name:       this.#name,
      equippedBy: this.#equippedBy,
    }
  }

  static unpack(data) {
    let weapon = new Weapon(data.weaponType);
        weapon.#id = data.id;
        weapon.#name = data.name;
        weapon.#equippedBy = data.equippedBy;
    return weapon;
  }

  packForBattle() {
    return {
      name: this.getName(),
      modes: this.getModes(),
    };
  }

}