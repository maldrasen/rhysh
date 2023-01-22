global.Feature = class Feature {

  constructor(name) {
    const template = DungeonBuilder.lookupFeatureTemplate(name);
    this.tileSource = template.copyTileSource();
    this.canFlip = template.canFlip;
  }

  // ==== Flipping =====================================================================================================
  // As a way to get more variety out of the feature templates we allow most features to be freely flipped, turning
  // each feature into eight, unless they're symetrical of course.

  randomFlip() {
    if (this.canFlip) {
      if (Random.flipCoin()) { this.flipH(); }
      if (Random.flipCoin()) { this.flipV(); }
      if (Random.flipCoin()) { this.flipD(); }
    }
  }

  flipH() {
//   for z in layers.size():
//     var oldTiles = layers[z]

//     layers[z] = []
//     layers[z].resize(self.size.x * self.size.y)

//     for y in self.size.y:
//       var newX = self.size.x - 1
//       for x in self.size.x:
//         var oldIndex = x + (y * self.size.x)
//         var newIndex = newX + (y * self.size.x)

//         layers[z][newIndex] = oldTiles[oldIndex]
//         newX -= 1

//         if layers[z][newIndex]:
//           layers[z][newIndex].flipH()
  }

  flipV() {
//   for z in layers.size():
//     var oldTiles = layers[z]

//     layers[z] = []
//     layers[z].resize(self.size.x * self.size.y)

//     for x in self.size.x:
//       var newY = self.size.y - 1
//       for y in self.size.y:
//         var oldIndex = x + (y * self.size.x)
//         var newIndex = x + (newY * self.size.x)

//         layers[z][newIndex] = oldTiles[oldIndex]
//         newY -= 1

//         if layers[z][newIndex]:
//           layers[z][newIndex].flipV()
  }

  flipD() {
//   var oldSize = size

//   self.size = Vector3i(oldSize.y, oldSize.x, oldSize.z)

//   for z in layers.size():
//     var oldTiles = layers[z]
//     var newX = size.x
//     var newY = 0

//     layers[z] = []
//     layers[z].resize(self.size.x * self.size.y)

//     for y in oldSize.y:
//       newY = size.y
//       newX -= 1
//       for x in oldSize.x:
//         newY -= 1
//         var oldIndex = x + (y * self.size.y)
//         var newIndex = newX + (newY * self.size.x)

//         layers[z][newIndex] = oldTiles[oldIndex]
//         if layers[z][newIndex]:
//           layers[z][newIndex].flipD()
  }

  forClient() {
    return this.tileSource.forClient();
  }

  static forPreview() {
    const feature = featureFromDebugOptions();
    feature.randomFlip();
    return { tileSource:feature.forClient() };
  }
}

const featureFromDebugOptions = function() {
  const options = Environment.debugOptions.featurePreview;

  if (options.featureSets) { return DungeonBuilder.randomFeatureFromSets(options.featureSets); }
  if (options.featureSet)  { return DungeonBuilder.randomFeatureFromSet(options.featureSet); }
  if (options.featureName) { return new Feature(featureName); }

  console.error("Unknown Debug Option: ",options);
}
