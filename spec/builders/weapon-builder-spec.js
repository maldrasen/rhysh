describe('WeaponBuilder', function() {

  it("builds a specific type of weapon", function() {
    let weapon = EquipmentBuilder.build({ weaponType:_byCode, code:'maul' });
    expect(weapon.getWeaponTypeCode()).to.equal('maul');
    expect(weapon.getWeaponType().range).to.equal(_close);
  });

  it("builds a close range, one handed weapon", function() {
    let weapon = EquipmentBuilder.build({ weaponType:_closeWeapons, hands:'1' });
    expect(weapon.getWeaponType().hands).to.equal('1');
    expect(weapon.getWeaponType().range).to.equal(_close);
  });

  it("builds a close range, two handed weapon", function() {
    let weapon = EquipmentBuilder.build({ weaponType:_closeWeapons, hands:'2' });
    expect(weapon.getWeaponType().hands).to.equal('2');
    expect(weapon.getWeaponType().range).to.equal(_close);
  });

  it("builds a close range, main handed weapon", function() {
    let weapon = EquipmentBuilder.build({ weaponType:_closeWeapons, hands:'M' });
    expect(weapon.getWeaponType().hands).to.equal('M');
    expect(weapon.getWeaponType().range).to.equal(_close);
  });

  it("builds a close range, one or main handed weapon", function() {
    let weapon = EquipmentBuilder.build({ weaponType:_closeWeapons, hands:'1/M' });
    expect(weapon.getWeaponType().hands).to.not.equal('2');
    expect(weapon.getWeaponType().range).to.equal(_close);
  });

  it("builds an extended range weapon", function() {
    let weapon = EquipmentBuilder.build({ weaponType:_extendedWeapons });
    expect(weapon.getWeaponType().range).to.equal(_extended);
  });

  it("builds a long range weapon", function() {
    let weapon = EquipmentBuilder.build({ weaponType:_longWeapons });
    expect(weapon.getWeaponType().range).to.equal(_long);
  });

  it("builds a cultist weapon", function() {
    let weapon = EquipmentBuilder.build({ weaponType:_cultWeapons });
    expect(weapon).to.not.be.null;
  });

  it("builds a mage weapon", function() {
    let weapon = EquipmentBuilder.build({ weaponType:_mageWeapons });
    expect(weapon).to.not.be.null;
  });

});
