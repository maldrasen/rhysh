describe.only('EquipmentBuilder', function() {

  it("builds leather chest armor", function() {
    let armor = EquipmentBuilder.build({ rarity:'normal', type:'chest', material:['leather','hide'] });
    expect(armor.slot).to.equal('chest');
    expect(armor.material).to.not.be.null;
    expect(armor.name).to.not.be.null;
  });

  it("builds cloth chest armor for a male", function() {
    let armor = EquipmentBuilder.build({ rarity:'normal', type:'chest', material:'cloth', archetype:'mindbender', sex:'male', species:'satyr' });
    expect(armor.material).to.equal('cloth');
  });

  it("builds cloth chest armor for a female", function() {
    let armor = EquipmentBuilder.build({ rarity:'normal', type:'chest', material:'cloth', archetype:'cultist', sex:'female', species:'elf' });
    expect(armor.material).to.equal('cloth');
  });


  it("builds lewd chest armor for a dominatrix", function() {
    let armor = EquipmentBuilder.build({ rarity:'normal', type:'chest', material:'leather', archetype:'dominatrix', sex:'futa', species:'elf' });
    expect(armor.material).to.equal('leather');
  });

});
