global.Attributes = class Attributes {

  constructor(map) {
    this.attributeMap = map;
  }

  getValue(attribute) { return this.attributeMap[attribute]; }
  getModifier(attribute) { return Attributes.modifierFor(this.attributeMap[attribute]); }

  setValue(attribute, value) { this.attributeMap[attribute] = value; }

  str() { return this.attributeMap[STR]; }
  dex() { return this.attributeMap[DEX]; }
  con() { return this.attributeMap[CON]; }
  int() { return this.attributeMap[INT]; }
  wis() { return this.attributeMap[WIS]; }
  cha() { return this.attributeMap[CHA]; }

  strModifier() { return Attributes.modifierFor(this.attributeMap[STR]); }
  dexModifier() { return Attributes.modifierFor(this.attributeMap[DEX]); }
  conModifier() { return Attributes.modifierFor(this.attributeMap[CON]); }
  intModifier() { return Attributes.modifierFor(this.attributeMap[INT]); }
  wisModifier() { return Attributes.modifierFor(this.attributeMap[WIS]); }
  chaModifier() { return Attributes.modifierFor(this.attributeMap[CHA]); }

  static modifierFor(value) {
    return Math.ceil((value-11)/2);
  }

  // === Persistance ===========================================================

  pack() {
    return this.attributeMap;
  }

  static unpack(data) {
    return new Attributes(data);
  }

}