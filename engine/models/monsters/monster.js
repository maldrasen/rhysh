global.Monster = class Monster {

  #abilities = [];
  #attributes
  #essence
  #hitPoints
  #naturalArmorClass

  // Pseudo Equipment
  #mainHand
  #offHand
  #armor

  constructor(options) {
  }

  setNaturalArmorClass(ac) { this.#naturalArmorClass = ac; }
  getNaturalArmorClass() { return this.#naturalArmorClass; }

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

  addAbility(ability) { this.#abilities.push(ability); }
  getAbilities() { return this.#abilities; }

  // This is probably feature creep, but I think some monsters will have a
  // slimmed down version of equipment that adds some variety to the
  // encounters. While this is mostly noticible with the weapons, we might as
  // well allow adjustments to the armor too.

  setMainHand(code) { this.#mainHand = code; }
  getMainHand() { return this.#mainHand; }

  setOffHand(code) { this.#offHand = code; }
  getOffHand() { return this.#offHand; }

  //
  setArmorMaterial(slot, code) { this.#armor = code; }
  getArmorMaterial(slot) { return this.#armor; }

  getArmorClass(slot) {



    // let armor = Armor.lookup(this.getArmor());
    // return this.getAttributes.dexModifier() +
  }



}
