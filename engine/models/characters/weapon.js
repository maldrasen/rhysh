global.Weapon = class Weapon {

  #id;
  #base;
  #name;
  #equippedBy;

  constructor(base) {
    this.#base = base;
    this.#name = WeaponDictionary.lookup(base).name;
  }

  getBase() { return this.#base; }
  getWeaponBase() { return WeaponDictionary.lookup(this.#base); }
  getDamage() { return this.getWeaponBase().damage; }
  getHands() { return this.getWeaponBase().hands; }
  getModes() { return this.getWeaponBase().modes; }
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
      base:       this.#base,
      id:         this.#id,
      name:       this.#name,
      equippedBy: this.#equippedBy,
    }
  }

  static unpack(data) {
    let weapon = new Weapon(data.base);
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