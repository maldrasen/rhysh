global.Monster = class Monster {

  #armorClass
  #attributes
  #essence
  #hitPoints
  #attacks = [];

  constructor(options) {
  }

  setArmorClass(ac) { this.#armorClass = ac; }
  getArmorClass() { return this.#armorClass; }

  setAttributes(attributes) { this.#attributes = attributes; }
  getAttributes() { return this.#attributes; }

  // Essence is the base amount of experience a player earns for killing a
  // monster. I'm calling this something other than experience because if a
  // monster is turned into a companion than experience will have a different
  // meaning. Adding new abilities to level up a monster should increase the
  // Monsters' essense.
  setEssence(essence) { this.#essence = essence; }
  getEssence() { return this.#essence; }

  setHitPoints(points) { this.#hitPoints = points; }
  getHitPoints() { return this.#hitPoints; }

  addAttack(attack) { this.#attacks.push(attack); }

}
