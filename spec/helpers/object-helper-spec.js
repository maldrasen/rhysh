describe('ObjectHelper', function() {

  it("iterates over object", function() {
    let stuff = { a:1, b:2, c:3 }
    let things = [];

    ObjectHelper.each(stuff, (key,value) => {
      things.push(key);
      things.push(value);
    });

    expect(things).to.eql(['a',1,'b',2,'c',3]);
  });

  it("Fetches from an object", function() {
    let sample = { foo:{ bar:{ herp:{ derp:'X' }}}};
    expect(ObjectHelper.fetch(sample,'foo','bar','herp','derp')).to.equal('X');
    expect(ObjectHelper.fetch(sample,'foo','bar','horse')).to.be.undefined;
  });

  it("Gets an object's values", function() {
    expect(ObjectHelper.values({ a:1, b:2, c:3 })).to.eql([1,2,3]);
  });

  it("Filters for certain keys", function() {
    let stuff = { a:1, b:2, c:3, d:4, e:5 };
    let things = ObjectHelper.filter(stuff,['b','d']);
    expect(ObjectHelper.values(things)).to.eql([2,4]);
  });

  it("Selects entries from an object", function() {
    let stuff = { a:1, b:2, c:3, d:4, e:5 };
    let things = ObjectHelper.select(stuff, (key, value) => { return value < 3 });
    expect(ObjectHelper.values(things)).to.eql([1,2]);
  });

  it("Detects an empty object", function() {
    expect(ObjectHelper.isEmpty({})).to.be.true;
    expect(ObjectHelper.isEmpty({ herp:'derp' })).to.be.false;
  });

});
