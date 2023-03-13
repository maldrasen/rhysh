describe('CooldownTable', function() {
  it("sets and reduces cooldowns", function() {

    let table = new CooldownTable();
        table.set('stab',2);
        table.set('bite',3);

    expect(table.get('stab')).to.equal(2);
    expect(table.get('bite')).to.equal(3);

    table.reduce();
    expect(table.get('stab')).to.equal(1);
    expect(table.get('bite')).to.equal(2);

    table.reduce();
    expect(table.get('stab')).to.be.undefined;
    expect(table.get('bite')).to.equal(1);
  });
})