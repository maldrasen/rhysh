global.FeatureTemplate = class FeatureTemplate {

  constructor(info) {
    this.layers = []
    this.name = info["Name"]
    this.canFlip = info["Flip"]
    this.size = new Vector(info["Width"], info["Height"], info["Depth"])

    // TODO: May get rid of this actually.
    if (info["SectorType"]) {
      this.sectorType = info["SectorType"]
    }

    forUpTo(this.size.z, _ => {
      this.layers.push(new Array(this.size.x * this.size.y));
    });
  }

}
