global.Armor = class Armor {

  #id;
  #slot;
  #material;
  #name;
  #tags;
  #equippedBy;

  constructor(slot, material) {
    this.#slot = slot;
    this.#material = material;
    this.#equippedBy = null;
  }

  getID() { return this.#id; }
  setID(id) { this.#id = id; }

  getSlot() { return this.#slot; }
  getMaterial() { return this.#material; }
  getArmorBase() { return ArmorDictionary.lookup(this.#material); }
  getArmorClass() { return this.getArmorBase().ac; }
  getWeightClass() { return this.getArmorBase().weight; }
  getMaxDex() { return this.getArmorBase().maxDex; }
  getMinStr() { return this.getArmorBase().minStr; }

  getName() { return this.#name; }
  setName(name) { this.#name = name; }

  getTags() { return [...this.#tags]; }
  hasTag(tag) { return this.#tags.indexOf(tag) >= 0; }
  addTag(tag) { this.#tags.push(tag); }
  setTags(tags) { this.#tags = tags; }

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
      id:         this.#id,
      slot:       this.#slot,
      material:   this.#material,
      name:       this.#name,
      tags:       this.#tags,
      equippedBy: this.#equippedBy,
    }
  }

  static unpack(data) {
    let armor = new armor(data.slot, data.material);
        armor.#id = data.id;
        armor.#name = data.name;
        armor.#tags = data.tags;
        armor.#equippedBy = data.equippedBy;
    return armor;
  }

}
