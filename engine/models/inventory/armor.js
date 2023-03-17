global.Armor = class Armor {

  #id;
  #slot;
  #armorType;
  #name;
  #tags;
  #equippedBy;

  constructor(slot, armorType) {
    this.#slot = slot;
    this.#armorType = armorType;
    this.#equippedBy = null;
  }

  getID() { return this.#id; }
  setID(id) { this.#id = id; }

  getSlot() { return this.#slot; }
  getArmorTypeCode() { return this.#armorType; }
  getArmorType() { return ArmorType.lookup(this.#armorType); }
  getArmorClass() { return this.getArmorType().ac; }
  getWeightClass() { return this.getArmorType().weight; }
  getMaxDex() { return this.getArmorType().maxDex; }
  getMinStr() { return this.getArmorType().minStr; }

  getName() { return this.#name; }
  setName(name) { this.#name = name; }

  getTags() { return [...this.#tags]; }
  hasTag(tag) { return this.#tags.indexOf(tag) >= 0; }
  addTag(tag) { this.#tags.push(tag); }
  setTags(tags) { this.#tags = tags; }

  isLewd() { return this.hasTag('lewd'); }
  isRoomy() { return this.hasTag('roomy'); }

  // === Equipment =============================================================

  getEquippedBy() { return { ...this.#equippedBy }; }

  setEquippedBy(character, slot) {
    if (slot == null) {
      throw `Determine slot from type?`
    }
    if (['head','chest','legs','hands','feet'].indexOf(slot) < 0) {
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
      classname:  'Armor',
      id:         this.#id,
      slot:       this.#slot,
      armorType:  this.#armorType,
      name:       this.#name,
      tags:       this.#tags,
      equippedBy: this.#equippedBy,
    }
  }

  static unpack(data) {
    let armor = new Armor(data.slot, data.armorType);
        armor.#id = data.id;
        armor.#name = data.name;
        armor.#tags = data.tags;
        armor.#equippedBy = data.equippedBy;
    return armor;
  }

}
