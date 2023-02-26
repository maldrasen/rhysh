describe('EquipmentBuilder', function() {

  it("builds leather chest armor", function() {
    let armor = EquipmentBuilder.build({ rarity:'normal', type:'chest', material:['leather','hide'] });
    expect(armor.getSlot()).to.equal('chest');
    expect(armor.getMaterial()).to.not.be.null;
    expect(armor.getName()).to.not.be.null;
  });

  it("builds cloth chest armor for a male", function() {
    let character = SpecHelper.randomMainCharacter({ archetype:'mindbender', sex:'male', species:'satyr' });
    let armor = EquipmentBuilder.build({ rarity:'normal', type:'chest', material:'cloth', for:character });

    expect(armor.getMaterial()).to.equal('cloth');
    expect(armor.getArmorClass()).to.equal(1);
    expect(armor.getWeightClass()).to.equal('light');
    expect(ArrayHelper.contains(armor.getTags(),'female')).to.be.false;
  });

  it("builds cloth chest armor for a female", function() {
    let character = SpecHelper.randomMainCharacter({ archetype:'cultist', sex:'female', species:'elf' });
    let armor = EquipmentBuilder.build({ rarity:'normal', type:'chest', material:'cloth', for:character });
    expect(armor.getMaterial()).to.equal('cloth');
  });

  it("builds lewd chest armor for a dominatrix", function() {
    let character = SpecHelper.randomMainCharacter({ archetype:'dominatrix', sex:'futa', species:'lupin' });
    let armor = EquipmentBuilder.build({ rarity:'normal', type:'chest', material:'leather', for:character });
    expect(ArrayHelper.contains(armor.getTags(),'lewd')).to.be.true;
    expect(armor.getMaterial()).to.equal('leather');
  });

  it("builds leg armor", function() {
    let character = SpecHelper.randomMainCharacter({ archetype:'mindbender', sex:'futa', species:'elf' });
    let armor = EquipmentBuilder.build({ rarity:'normal', type:'legs', material:'cloth', for:character });
    expect(armor.getMaterial()).to.equal('cloth');
  });

  it("builds roomy leg armor for a minotaur", function() {
    let character = SpecHelper.randomMainCharacter({ archetype:'knight', sex:'male', species:'minotaur' });
    let armor = EquipmentBuilder.build({ rarity:'normal', type:'legs', material:'plate', for:character });
    expect(ArrayHelper.contains(armor.getTags(),'roomy')).to.be.true;
    expect(armor.getMaterial()).to.equal('plate');
  });

  it("builds lewd leg armor for a dominatrix", function() {
    let character = SpecHelper.randomMainCharacter({ archetype:'dominatrix', sex:'female', species:'orc' });
    let armor = EquipmentBuilder.build({ rarity:'normal', type:'legs', material:['leather','hide'], for:character });
    expect(ArrayHelper.contains(armor.getTags(),'lewd')).to.be.true;
  });

  it("builds head armor", function() {
    let character = SpecHelper.randomMainCharacter({ archetype:'knight', sex:'male', species:'orc' });
    let armor = EquipmentBuilder.build({ rarity:'normal', type:'head', material:'plate', for:character });
    expect(armor.getMaterial()).to.equal('plate');
  });

  it("builds hand armor", function() {
    let character = SpecHelper.randomMainCharacter({ archetype:'cultist', sex:'male', species:'elf' });
    let armor = EquipmentBuilder.build({ rarity:'normal', type:'hands', material:'cloth', for:character });
    expect(armor.getMaterial()).to.equal('cloth');
  });

  it("builds foot armor", function() {
    let character = SpecHelper.randomMainCharacter({ archetype:'slaver', sex:'futa', species:'satyr' });
    let armor = EquipmentBuilder.build({ rarity:'normal', type:'feet', material:'leather', for:character });
    expect(armor.getMaterial()).to.equal('leather');
  });

});
