window.Dungeon = (function() {

  let active;
  let moving;

  // I'm making the map view a child of the dungeon view. While this doesn't really seem nessessary now my intent is
  // for the Dungeon UI to also be a child of this view. This will include the character portraits and the buttons and
  // indicators and such that the previews didn't need.
  function init() {

    const when = (e) => {
      if (EscapeMenu.isOpen()) { return false; }
      if (OptionsOverlay.isOpen()) { return false; }
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
    X.onWheelUp(when,      e => { MapCanvas.zoomIn(); });
    X.onWheelDown(when,    e => { MapCanvas.zoomOut(); });
  }

  function show(state) {
    active = true;

    MainContent.clear();
    PartyPanel.show(state.status);

    MapView.showDungeon({
      location: state.location,
      tileSource: state.zone.tileSource,
    });
  }

  function requestMove(direction) {
    if (moving) { return; }

    moving = direction;
    ClientCommands.send('dungeon.request-move',{ direction }).then(response => {
      moving = null;

      if (response.action == 'changeZone') { return handleZoneChange(); }
      if (response.action != 'none') { MapView.move(response); }
      if (response.doorAction) { handleDoor(response); }
    });
  }

  function handleZoneChange() {
    MainContent.clear();
    MapView.clear();
    ClientCommands.send('game.render');
  }

  function handleDoor(response) {
    console.log(`TODO: Door Event (${response.doorAction}) ${response.doorStory}`);
  }

  return {
    init,
    show,
  };

})();