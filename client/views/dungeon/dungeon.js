window.Dungeon = (function() {

  let active;
  let moving;

  // I'm making the map view a child of the dungeon view. While this doesn't really seem nessessary now my intent is
  // for the Dungeon UI to also be a child of this view. This will include the character portraits and the buttons and
  // indicators and such that the previews didn't need.
  function init() {

    const when = (e) => {
      return active && MapCanvas.visible();
    }

    X.onKeyDown('w', when, e => { requestMove('N'); });
    X.onKeyDown('s', when, e => { requestMove('S'); });
    X.onKeyDown('d', when, e => { requestMove('E'); });
    X.onKeyDown('a', when, e => { requestMove('W'); });
    X.onArrowUp(when,      e => { requestMove('N'); });
    X.onArrowDown(when,    e => { requestMove('S'); });
    X.onArrowRight(when,   e => { requestMove('E'); });
    X.onArrowLeft(when,    e => { requestMove('W'); });
  }

  function requestMove(direction) {
    if (moving) { return console.log("Already Moving...") }

    moving = direction;
    ClientCommands.send('dungeon.request-move',{ direction }).then(response => {
      console.log("Moved:",response)
      moving = null;
    });
  }

  function show(options) {
    active = true;

    MainContent.clear();
    MapView.showDungeon({
      location: options.location,
      tileSource: options.zone.tileSource,
    });
  }

  return {
    init,
    show,
  };

})();