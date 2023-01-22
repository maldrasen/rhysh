describe('VectorArray', function() {

  it("acts like array of vectors", function() {
    let vectors = new VectorArray();
    vectors.push(new Vector(1,1,1));
    vectors.push(new Vector(2,2,2));
    vectors.push(new Vector(3,3,3));

    let copy = vectors.copy();

    expect(vectors.size()).to.equal(3);
    expect(copy.get(1).x).to.equal(2);
    expect(copy.indexOf(new Vector(3,3,3))).to.equal(2);
    expect(copy.indexOf(new Vector(0,0,0))).to.equal(-1);
  });

  it("removes vectors by value", function() {
    let vectors = new VectorArray();
    vectors.push(new Vector(1,1,1));
    vectors.push(new Vector(2,2,2));
    vectors.push(new Vector(3,3,3));

    vectors.remove(new Vector(2,2,2));
    vectors.remove(new Vector(1,1,1));

    expect(vectors.get(0).x).to.equal(3);
  });

});