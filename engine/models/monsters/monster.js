global.Monster = class Monster {

  #name
  #abilities = [];
  #attributes
  #essence
  #maxHitPoints
  #currentHitPoints
  #baseArmorClass
  #baseHit

  #slots
  #mainHand
  #offHand
  #armor = {};

  #condition = 'normal';
  #statuses = {};
  #cooldowns = {};

  constructor(options) {}

  getName() { return this.#name; }
  setName(name) { this.#name = name; }

  getBaseArmorClass() { return this.#baseArmorClass; }
  setBaseArmorClass(armorClass) { this.#baseArmorClass = armorClass; }

  getBaseHit() { return this.#baseHit; }
  setBaseHit(hit) { this.#baseHit = hit; }

  getAttributes() { return this.#attributes; }
  setAttributes(attributes) { this.#attributes = attributes; }

  // Essence is the base amount of experience a player earns for killing a
  // monster. I'm calling this something other than experience because if a
  // monster is turned into a companion than experience will have a different
  // meaning. Adding new abilities to level up a monster should increase the
  // Monsters' essense.
  getEssence() { return this.#essence; }
  setEssence(essence) { this.#essence = essence; }

  getMaxHitPoints() { return this.#maxHitPoints; }
  setMaxHitPoints(points) {
    this.#maxHitPoints = points;
    this.#currentHitPoints = points;
  }

  getCurrentHitPoints() { return this.#currentHitPoints; }
  setCurrentHitPoints(points) { this.#currentHitPoints = points; }

  // Health is a percentage of current and max health.
  getHealth() {
    return Math.ceil(100 * this.getCurrentHitPoints() / this.getMaxHitPoints());
  }

  // === State and Status ======================================================
  // State and status are functionally similar. The difference is that the
  // monster can only be in one state at a time but can have multiple status
  // effects. Blind is a status effect, grappling is a state.

  getCondition() { return this.#condition; }
  setCondition(condition) {
    Condition.lookup(condition);
    this.#condition = condition;
  }

  getStatuses() { return { ...this.#statuses }; }
  hasStatus() { return this.statuses[code] != null; }
  setStatus(code, duration) { this.#statuses[code] = duration; }
  removeStatus(code) { delete this.#statuses[code]; }

  // === Abilities =============================================================

  getAbilities() { return this.#abilities; }

  // Hmm, before this can be done we need to set the actor in the context, but
  // before I can do that I need actors in the battle state.
  getAvailableAbilities() {
    let available = [];
    let context = new WeaverContext();
    return available;
  }

  hasAbilities() { return this.#abilities.length > 0; }

  getRandomAbility() {
    return Random.from(this.getAvailableAbilities());
  }

  // This should be called every time an ability is used, first to validate
  // that an ability can be used. This function also sets the ability cooldown
  // if the ability has a cooldown.
  useAbility(code) {
    let available = this.getAvailableAbilities();
    let template = AbilityDictionary.lookup(code);
    let ability;

    for (let i=0; i<available.length; i++) {
      if (available[i].code == code) { ability = available[i]; }
    }

    if (ability == null) {
      throw `Cannot use Ability(${code})`;
    }

    if (template.selfSetState) {
      this.setState(template.selfSetState);
    }

    if (template.cooldown) {
      this.#cooldowns[code] = template.cooldown;
    }
  }

  // We call lookup on the ability just to make sure that it exists.
  addAbility(ability) {
    AbilityDictionary.lookup(ability.code);
    this.#abilities.push(ability);
  }

  // === Weapons and Armor =====================================================

  getSlots() { return this.#slots; }
  setSlots(slots) { this.#slots = slots; }
  setNormalSlots() { this.#slots = { head:1, chest:4, legs:3, hands:1, feet:1 }}

  // This is probably feature creep, but I think some monsters will have a
  // slimmed down version of equipment that adds some variety to the
  // encounters. While this is mostly noticible with the weapons, we might as
  // well allow adjustments to the armor too.
  getMainHand() { return this.#mainHand; }
  setMainHand(code) { this.#mainHand = code; }

  getOffHand() { return this.#offHand; }
  setOffHand(code) { this.#offHand = code; }

  getArmorMaterial(slot) { return this.#armor[slot]; }
  setArmorMaterial(slot, code) {
    if (code == 'none') { code = null; }
    this.#armor[slot] = code;
  }

  setRandomArmor(armorMap) {
    Object.keys(this.getSlots()).forEach(slot => {
      if (armorMap[slot] != null) {
        this.setArmorMaterial(slot,Random.fromFrequencyMap(armorMap[slot]))
      }
    });
  }

  setRandomWeapon(weaponMap) {
    let mainHand = Random.fromFrequencyMap(weaponMap);
    let offHand = null;

    if (mainHand == 'club-shield')     { mainHand = 'club';     offHand = 'shield'; }
    if (mainHand == 'scimitar-shield') { mainHand = 'scimitar'; offHand = 'shield'; }
    if (mainHand == 'two-daggers')     { mainHand = 'dagger';   offHand = 'dagger'; }

    if (mainHand) { this.setMainHand(mainHand); }
    if (offHand) { this.setOffHand(offHand); }
  }

  getArmorClass(slot) {
    let dexBonus = this.getAttributes().dexModifier();
    let shieldBonus = this.getOffHand() == 'shield' ? 1 : 0;
    let material = this.getArmorMaterial(slot)
    let armorBonus = 0;

    if (material) {
      let armor =  MaterialDictionary.lookup(material);
      if (armor.maxDex && dexBonus > armor.maxDex) {
        dexBonus = armor.maxDex;
      }
      armorBonus = armor.ac || 0;
    }

    return this.getBaseArmorClass() + dexBonus + armorBonus + shieldBonus;
  }

  // === Packing ===============================================================

  // Monsters are usually thrown away after a battle and because we never save
  // during a battle the monsters are never persisted. We still need a pack()
  // function to get the monster data up to the client to view in the battle UI.
  pack() {
    return {
      name: this.getName(),
      health: this.getHealth(),
      condition: this.getCondition(),
      statuses: this.getStatuses(),
    };
  }

}
