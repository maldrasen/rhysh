global.Attributes = class Attributes {

  constructor(map) {
    this.attributeMap = map;
  }

  getValue(attribute) { return this.attributeMap[attribute]; }
  getModifier(attribute) { return Attributes.modifierFor(this.attributeMap[attribute]); }

  setValue(attribute, value) { this.attributeMap[attribute] = value; }

  str() { return this.attributeMap[_str]; }
  dex() { return this.attributeMap[_dex]; }
  con() { return this.attributeMap[_con]; }
  int() { return this.attributeMap[_int]; }
  wis() { return this.attributeMap[_wis]; }
  cha() { return this.attributeMap[_cha]; }

  // TODO: Status effects can adjust stat bonuses.
  strModifier() { return Attributes.modifierFor(this.attributeMap[_str]); }
  dexModifier() { return Attributes.modifierFor(this.attributeMap[_dex]); }
  conModifier() { return Attributes.modifierFor(this.attributeMap[_con]); }
  intModifier() { return Attributes.modifierFor(this.attributeMap[_int]); }
  wisModifier() { return Attributes.modifierFor(this.attributeMap[_wis]); }
  chaModifier() { return Attributes.modifierFor(this.attributeMap[_cha]); }

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