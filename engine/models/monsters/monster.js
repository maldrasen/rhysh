global.Monster = class Monster {

  #id;
  #name;
  #sizeClass;
  #abilities = [];
  #attributes;
  #condition;

  #essence;
  #baseArmorClass;
  #baseHit;

  #slots;
  #mainHand;
  #offHand;
  #armor = {};

  #cooldowns = {};

  constructor(options) {
    this.#condition = new Condition();
  }

  // The monster ID will probably only be used by the battle state. This is how
  // we keep of which monster is which during a battle, but I don't think
  // there's any other use for it as they're only unique for that battle.
  getID() { return this.#id; }
  setID(id) { this.#id = id; }

  getName() { return this.#name; }
  setName(name) { this.#name = name; }

  getSizeClass() { return this.#sizeClass; }
  setSizeClass(size) {
    if (SizeClass[size] == null) { throw `Invalid Size Class: ${size}`; }
    this.#sizeClass = size;
  }

  getBaseArmorClass() { return this.#baseArmorClass; }
  setBaseArmorClass(armorClass) { this.#baseArmorClass = armorClass; }

  getBaseHit() { return this.#baseHit; }
  setBaseHit(hit) { this.#baseHit = hit; }

  getAttributes() { return this.#attributes; }
  setAttributes(attributes) { this.#attributes = attributes; }

  getCondition() { return this.#condition; }
  setMaxHitPoints(points) { this.#condition.setMaxHitPoints(points); }

  // Essence is the base amount of experience a player earns for killing a
  // monster. I'm calling this something other than experience because if a
  // monster is turned into a companion than experience will have a different
  // meaning. Adding new abilities to level up a monster should increase the
  // Monsters' essense.
  getEssence() { return this.#essence; }
  setEssence(essence) { this.#essence = essence; }

  // === Members ===============================================================

  rollForInitiative() { return RollsInitiative.rollFor(this); }

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

  // Oh dear, looks like we're back to needing to do some stuff here.
  chooseCombatAction() {
    return null;
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
      let armor =  ArmorDictionary.lookup(material);
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
      id: this.getID(),
      name: this.getName(),
      health: this.#condition.getHealth(),
      condition: this.#condition.getCondition(),
      statuses: this.#condition.getStatuses(),
      size: this.getSizeClass(),
    };
  }

}
