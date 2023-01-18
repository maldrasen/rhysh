global.Zone = class Zone {

  constructor(properties) {
    console.log("Build Zone From : ",properties)
  }

  static forPreview() {
    let options = Environment.debugOptions.zonePreview;
    console.log("TODO: Preview Zone")
    console.log(options)
    return {}
  }

}
