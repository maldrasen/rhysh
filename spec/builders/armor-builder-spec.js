describe('ArmorBuilder', function() {

  it("builds leather chest armor", function() {
    let armor = EquipmentBuilder.build({ slot:_chest, armorType:[_leather,_hide] });
    expect(armor.getSlot()).to.equal(_chest);
    expect(armor.getArmorTypeCode()).to.not.be.null;
    expect(armor.getName()).to.not.be.null;
  });

  it("builds cloth chest armor for a male", function() {
    let character = SpecHelper.randomMainCharacter({ archetype:_mindbender, sex:_male, species:_satyr });
    let armor = EquipmentBuilder.build({ slot:_chest, armorType:[_cloth], for:character });

    expect(armor.getArmorTypeCode()).to.equal(_cloth);
    expect(armor.getArmorClass()).to.equal(1);
    expect(armor.getWeightClass()).to.equal(_lightArmor);
    expect(ArrayHelper.contains(armor.getTags(),_female)).to.be.false;
  });

  it("builds cloth chest armor for a female", function() {
    let character = SpecHelper.randomMainCharacter({ archetype:_cultist, sex:_female, species:_elf });
    let armor = EquipmentBuilder.build({ slot:_chest, armorType:[_cloth], for:character });
    expect(armor.getArmorTypeCode()).to.equal(_cloth);
  });

  it("builds lewd chest armor for a dominatrix", function() {
    let character = SpecHelper.randomMainCharacter({ archetype:_dominatrix, sex:_futa, species:_lupin });
    let armor = EquipmentBuilder.build({ slot:_chest, armorType:[_leather], for:character });
    expect(ArrayHelper.contains(armor.getTags(),_lewd)).to.be.true;
    expect(armor.getArmorTypeCode()).to.equal(_leather);
  });

  it("builds leg armor", function() {
    let character = SpecHelper.randomMainCharacter({ archetype:_mindbender, sex:_futa, species:_elf });
    let armor = EquipmentBuilder.build({ slot:_legs, armorType:[_cloth], for:character });
    expect(armor.getArmorTypeCode()).to.equal(_cloth);
  });

  it("builds roomy leg armor for a minotaur", function() {
    let character = SpecHelper.randomMainCharacter({ archetype:_knight, sex:_male, species:_minotaur });
    let armor = EquipmentBuilder.build({ rarity:_normal, slot:_legs, armorType:[_plate], for:character });
    expect(ArrayHelper.contains(armor.getTags(),_roomy)).to.be.true;
    expect(armor.getArmorTypeCode()).to.equal(_plate);
  });

  it("builds lewd leg armor for a dominatrix", function() {
    let character = SpecHelper.randomMainCharacter({ archetype:_dominatrix, sex:_female, species:_orc });
    let armor = EquipmentBuilder.build({ slot:_legs, armorType:[_leather,_hide], for:character });
    expect(ArrayHelper.contains(armor.getTags(),_lewd)).to.be.true;
  });

  it("builds head armor", function() {
    let character = SpecHelper.randomMainCharacter({ archetype:_knight, sex:_male, species:_orc });
    let armor = EquipmentBuilder.build({ slot:_head, armorType:[_plate], for:character });
    expect(armor.getArmorTypeCode()).to.equal(_plate);
  });

  it("builds hand armor", function() {
    let character = SpecHelper.randomMainCharacter({ archetype:_cultist, sex:_male, species:_elf });
    let armor = EquipmentBuilder.build({ slot:_hands, armorType:[_cloth], for:character });
    expect(armor.getArmorTypeCode()).to.equal(_cloth);
  });

  it("builds foot armor", function() {
    let character = SpecHelper.randomMainCharacter({ archetype:_slaver, sex:_futa, species:_satyr });
    let armor = EquipmentBuilder.build({ slot:_hands, armorType:[_leather], for:character });
    expect(armor.getArmorTypeCode()).to.equal(_leather);
  });

});
