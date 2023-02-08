global.Character = class Character {

  getAttributes() { return this.attributes; }
  getArchetypeCode() { return this.archetypeCode; }
  getSpeciesCode() { return this.speciesCode; }
  getArchetype() { return Archetype.lookup(this.archetypeCode); }
  getSpecies() { return Species.lookup(this.speciesCode); }

  // === Persistance ===========================================================

  pack() {
    return {
      archetypeCode: this.archetypeCode,
      speciesCode: this.speciesCode,
      attributes: this.attributes.pack(),
    }
  }

  static unpack(data) {
    this.archetypeCode = data.archetypeCode;
    this.speciesCode = data.speciesCode;
    this.attributes = Attributes.unpack(data.attributes);
  }

}
