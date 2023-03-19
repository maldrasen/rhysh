global.ZonePreview = (function() {

  function render() {
    let options = Environment.debugOptions.zonePreview;

    let builder = new ZoneBuilder(options.zone);
        builder.buildZone();

    let zone = Zone.lookup(options.zone);
        zone.setTileSource(builder.getTileSource());

    let origin = zone.origins[options.origin];

    Switchboard.render({
      showView: "ZonePreview",
      location: origin.pack(),
      zone: zone.pack(),
    });
  }

  return { render };

})();
