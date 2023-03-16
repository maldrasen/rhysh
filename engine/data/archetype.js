const ArchetypeDictionary = {}

global.Archetype = class Archetype {

  static register(archetype) {
    ArchetypeDictionary[archetype.code] = archetype;
  }

  static lookup(code) {
    if (ArchetypeDictionary[code] == null) { throw `Unknown Archetype (${code})` }
    return ArchetypeDictionary[code];
  }

  #code;
  #name;

  #availableSexes;
  #availableSpecies;
  #attributeBonus;
  #hitGrowth;
  #hitDice;
  #armorType;
  #weaponType;

  #arcanumList;
  #gnosisList;
  #powerList;

  #startingEquipment;
  #startingSkills;

  constructor(options) {
    this.#code = options.code;
    this.#name = options.name;
    this.#availableSexes = options.availableSexes;
    this.#availableSpecies = options.availableSpecies;
    this.#attributeBonus = options.attributeBonus;
    this.#hitGrowth = options.hitGrowth;
    this.#hitDice = options.hitDice;
    this.#armorType = options.armorType;
    this.#weaponType = options.weaponType;

    this.#arcanumList = [];
    this.#gnosisList = [];
    this.#powerList = [];
  }

  get code() { return this.#code; }
  get name() { return this.#name; }
  get availableSexes() { return this.#availableSexes; }
  get availableSpecies() { return this.#availableSpecies; }
  get attributeBonus() { return this.#attributeBonus; }
  get hitGrowth() { return this.#hitGrowth; }
  get hitDice() { return this.#hitDice; }
  get armorType() { return this.#armorType; }
  get weaponType() { return this.#weaponType; }
  get startingEquipment() { return this.#startingEquipment; }
  get startingSkills() { return this.#startingSkills; }

  addArcanum(code) {
    // ArcanumBase.lookup(code);
    this.#arcanumList.push(code);
  }

  addGnosis(code) {
    // GnosisBase.lookup(code);
    this.#gnosisList.push(code);
  }

  addPower(code) {
    // PowerBase.lookup(code);
    this.#powerList.push(code);
  }

  setStartingEquipment(equipment) { this.#startingEquipment = equipment; }
  setStartingSkills(skills) { this.#startingSkills = skills; }
}
