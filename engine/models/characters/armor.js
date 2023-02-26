global.Armor = class Armor {

  #id;
  #slot;
  #material;
  #name;
  #tags;

  constructor(slot, material) {
    this.#slot = slot;
    this.#material = material;
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

  // === Persistance ===========================================================

  pack() {
    return {
      id:       this.#id,
      slot:     this.#slot,
      material: this.#material,
      name:     this.#name,
      tags:     this.#tags,
    }
  }

  static unpack(data) {
    let armor = new armor(data.slot, data.material);
        armor.#id = data.id;
        armor.#name = data.name;
        armor.#tags = data.tags;
    return armor;
  }

}
