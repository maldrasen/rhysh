const SpeciesDictionary = {}

global.Species = class Species {

  static register(code, species) {
    species.setCode(code);
    SpeciesDictionary[code] = species;
  }

  static lookup(code) {
    if (SpeciesDictionary[code] == null) { throw `Unknown Species (${code})` }
    return SpeciesDictionary[code];
  }

  #code;
  #name;
  #baseAttributes;
  #baseArmorClass;
  #baseHitPoints;
  #experienceFactor;
  #arcanumList;
  #gnosisList;
  #powerList;

  constructor(options) {
    this.#name = options.name;
    this.#baseAttributes = options.baseAttributes;
    this.#baseArmorClass = options.baseArmorClass;
    this.#baseHitPoints = options.baseHitPoints;
    this.#experienceFactor = options.experienceFactor || 1;

    this.#arcanumList = [];
    this.#gnosisList = [];
    this.#powerList = [];
  }

  get code() { return this.#code; }
  get name() { return this.#name; }
  get baseAttributes() { return this.#baseAttributes; }
  get baseArmorClass() { return this.#baseArmorClass; }
  get baseHitPoints() { return this.#baseHitPoints; }
  get experienceFactor() { return this.#experienceFactor; }

  get arcanumList() { return this.#arcanumList; }
  get gnosisList() { return this.#gnosisList; }
  get powerList() { return this.#powerList; }

  setCode(code) {
    if (this.#code == null) {
      this.#code = code;
    }
  }

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

}
