global.Feature = (function() {

  it.only("Gets a random Feature", function() {
    let feature = Feature.randomFromSets(['caves','farms']);
    console.log(feature)
  });

});