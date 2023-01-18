global.Feature = class Feature {

  constructor(properties) {
    console.log("Build Feature From : ",properties)
  }

  static forPreview() {
    let options = Environment.debugOptions.featurePreview;
    console.log("TODO: Preview Features")
    console.log(options)
    return options;
  }

}