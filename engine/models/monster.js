global.Monster = class Monster {

  #id;
  #name;
  #body;
  #abilities = [];
  #attributes;
  #condition;
  #flags;

  #essence;
  #baseArmorClass;
  #baseHit;
  #abilityChance;

  #basicAttackDamage;
  #basicAttackText;
  #mainHand;
  #offHand;
  #armor;

  #cooldownTable;
  #threatTable;

  constructor(options) {
    this.abilityChance = 25;

    this.#condition = new Condition();
    this.#threatTable = new ThreatTable();
    this.#cooldownTable = new CooldownTable();

    this.#armor = {};
    this.#flags = {};
  }

  // The monster ID will probably only be used by the battle state. This is how
  // we keep of which monster is which during a battle, but I don't think
  // there's any other use for it as they're only unique for that battle.
  getID() { return this.#id; }
  setID(id) { this.#id = id; }

  getName() { return this.#name; }
  setName(name) { this.#name = name; }
  getStoryName() { return `the ${this.#name}`; }

  getBaseArmorClass() { return this.#baseArmorClass; }
  setBaseArmorClass(armorClass) { this.#baseArmorClass = armorClass; }

  getBaseHit() { return this.#baseHit; }
  setBaseHit(hit) { this.#baseHit = hit; }

  getAbilityChance() { return this.#abilityChance; }
  setAbilityChance(chance) { this.#abilityChance = chance; }

  getAttributes() { return this.#attributes; }
  setAttributes(attributes) { this.#attributes = attributes; }

  getCondition() { return this.#condition; }
  hasCondition(condition) { return this.#condition.hasCondition(condition); }
  hasStatus(status) { return this.#condition.hasStatus(status); }
  doDamage(points) { this.#condition.doDamage(points); }

  getMaxHitPoints() { return this.#condition.getMaxHitPoints(); }
  setMaxHitPoints(points) { this.#condition.setMaxHitPoints(points); }

  // Essence is the base amount of experience a player earns for killing a
  // monster. I'm calling this something other than experience because if a
  // monster is turned into a companion than experience will have a different
  // meaning. Adding new abilities to level up a monster should increase the
  // Monsters' essense.
  getEssence() { return this.#essence; }
  setEssence(essence) { this.#essence = essence; }

  // === Members ===============================================================

  chooseCombatAction() { return MonsterAI.chooseCombatAction(this); }
  rollForInitiative() { return RollsInitiative.rollFor(this); }

  // === Flags =================================================================

  getFlag(key) { return this.#flags[key]; }
  hasFlag(key) { return this.#flags[key] != null; }
  setFlag(key,value) { this.#flags[key] = value; }

  makeLewd() { this.setFlag(_lewd,true); }
  isLewd() { return this.hasFlag(_lewd); }

  // === Monster Bodies ========================================================

  buildBody(options) { this.#body = new MonsterBody(options); }

  getBody() { return this.#body; }
  getSlots() { return this.#body.getSlots(); }
  getSizeClass() { return this.#body.getSizeClass(); }
  getSex() { return this.#body.getSex(); }

  isCockExposed() { return this.isLewd() && this.#body.hasCock(); }
  isPussyExposed() { return this.isLewd() && this.#body.hasPussy(); }
  areTitsExposed() { return this.isLewd() && this.#body.hasTits(); }

  briefDescriptionOfBalls() { return this.#body.briefDescriptionOfBalls(); }
  briefDescriptionOfCock() { return this.#body.briefDescriptionOfCock(); }
  briefDescriptionOfPussy() { return this.#body.briefDescriptionOfPussy(); }
  briefDescriptionOfTits() { return this.#body.briefDescriptionOfTits(); }

  // === Abilities =============================================================

  getBasicAttackDamage() { return this.#basicAttackDamage; }
  getBasicAttackText() { return this.#basicAttackText; }
  setBasicAttackDamage(damage) { this.#basicAttackDamage = damage; }
  setBasicAttackText(text) { this.#basicAttackText = text; }

  getAbilities() { return this.#abilities; }
  hasAbilities() { return this.#abilities.length > 0; }

  // We call lookup on the ability just to make sure that it exists. Abilities
  // added to the monster can have damage and hit modifiers set.
  //
  //   ability: {
  //     code:      Ability code for lookup in the ability dictionary
  //     damage:    Damage in dice format { x:1, d:6, p:2 }
  //     hit:       Hit modifier, can be positive or negative
  //   }
  //
  addAbility(ability) {
    Ability.lookup(ability);
    this.#abilities.push(ability);
  }

  // This should be called every time an ability is used in order to set the
  // ability cooldown if the ability has a cooldown. This may do other things
  // as well.
  useAbility(code) {
    let ability = Ability.lookup(code);
    if (ability.cooldown) {
      this.#cooldownTable.set(code,ability.cooldown);
    }
  }

  isAbilityOnCooldown(code) {
    return this.#cooldownTable.onCooldown(code);
  }

  reduceCooldowns() {
    this.#cooldownTable.reduce();
  }

  // === Weapons and Armor =====================================================

  // This is probably feature creep, but I think some monsters will have a
  // slimmed down version of equipment that adds some variety to the
  // encounters. While this is mostly noticible with the weapons, we might as
  // well allow adjustments to the armor too.
  getMainHandCode() { return this.#mainHand; }
  setMainHandCode(code) { this.#mainHand = code; }

  getOffHandCode() { return this.#offHand; }
  setOffHandCode(code) { this.#offHand = code; }

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

    if (mainHand) { this.setMainHandCode(mainHand); }
    if (offHand) { this.setOffHandCode(offHand); }
  }

  getArmorClass(slot) {
    let dexBonus = this.getAttributes().dexModifier();
    let shieldBonus = this.getOffHandCode() == 'shield' ? 1 : 0;
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
