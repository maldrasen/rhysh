global.Accessory = class Accessory {

  #id;
  #name;
  #effects;
  #equippedBy;

  constructor() {
    this.#effects = {};
  }

  getID() { return this.#id; }
  setID(id) { this.#id = id; }

  getName() { return this.#name; }
  setName(name) { this.#name = name; }

  getEffects() { return { ...this.#effects }; }
  addEffect(code,value) {
    this.#effects[code] = value;
  }

  // === Equipment =============================================================

  getEquippedBy() { return { ...this.#equippedBy }; }

  setEquippedBy(character, slot) {
    if (slot == null) {
      throw `Determine slot from type?`
    }
    if (Object.keys(AccessorySlots).indexOf(slot) < 0) {
      throw `Unrecognized accessory slot: ${slot}`;
    }
    if (character.canEquip(this) == false) {
      throw `Character(${character.getCode()}) cannot equip Item(${id})`;
    }

    this.#equippedBy = { code:character.getCode(), slot:slot };
  }

  // === Persistance ===========================================================

  pack() {
    return {
      classname:  'Accessory',
      id:         this.#id,
      name:       this.#name,
      effects:    this.#effects,
      equippedBy: this.#equippedBy,
    }
  }

  static unpack(data) {
    let accessory = new Accessory();
        accessory.#id = data.id;
        accessory.#name = data.name;
        accessory.#effects = data.effects;
        accessory.#equippedBy = data.equippedBy;
    return accessory;
  }

  // This will be called for off-hand accessories such as shields. I don't
  // think any accessories will have actual attack modes, but something like
  // 'block' should be included for display.
  packForBattle() {
    return {
      name: this.getName(),
      modes: ['block'],
    };
  }

}