global.Character = class Character {

  // The character code is part of the filename where the character is saved
  // and how the character is referenced in the CharacterLibrary.
  constructor(code) { this.code = code; }
  getCode() { return this.code; }

  setFirstName(name) { this.firstName = name; }
  setLastName(name) { this.lastName = name; }
  getFirstName() { return this.firstName; }
  getLastName()  { return this.lastName; }
  getFullName()  { return `${this.getFirstName()} ${this.getLastName()}`; }

  setSex(sex) { this.sex = sex; }
  getSex(sex) { return this.sex; }

  setArchetypeCode(code) { this.archetypeCode = code; }
  getArchetypeCode() { return this.archetypeCode; }
  getArchetype() { return Archetype.lookup(this.archetypeCode); }

  setSpeciesCode(code) { this.speciesCode = code; }
  getSpeciesCode() { return this.speciesCode; }
  getSpecies() { return Species.lookup(this.speciesCode); }

  setAttributes(attributesObject) { this.attributes = attributesObject; }
  getAttributes() { return this.attributes; }

  // === Persistance ===========================================================

  save() {
    CharacterLibrary.saveCharacter(this);
  }

  pack() {
    return {
      code: this.code,
      firstName: this.firstName,
      lastName: this.lastName,
      sex: this.sex,
      archetypeCode: this.archetypeCode,
      speciesCode: this.speciesCode,
      attributes: this.attributes.pack(),
    }
  }

  static unpack(data) {
    let character = new Character(data.code);
    character.firstName = data.firstName;
    character.lastName = data.lastName;
    character.sex = data.sex;
    character.archetypeCode = data.archetypeCode;
    character.speciesCode = data.speciesCode;
    character.attributes = Attributes.unpack(data.attributes);
    return character;
  }

}
