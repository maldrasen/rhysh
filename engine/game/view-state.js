global.ViewState = (function() {

  let gameState;

  function render(state) {
    gameState = state;

    console.log("Rendering View");
    console.log(gameState);

    Messenger.publish("browser.render",{ gameState });
  }

  return { render }

})();

    /*
    // If a current event is set then it should be rendered. This will happen
    // when events are chained together.
    if (Game.getCurrentEvent()) { return renderEvent(Game.getCurrentEvent()); }

    log(`Rendering [${Game.getPhase()}]`,true)

    // If there isn't a current event set in the Game then try to find one.
    // This function will advance the game time until a phase with an event is
    // found or it will return null if there are no events.
    const eventData = await Game.pullNextEvent();
    if (eventData) {
      return renderEvent(eventData);
    }

    // If there is nothing else to render then we render the current location.
    renderLocation();
    */


  // function renderEvent(eventData) {
  //   log(`Rendering Event: ${eventData.event.code}`);
  //   Event.prepare(eventData).then(prepared => {
  //     Browser.send('render.event', prepared);
  //   });
  // }

  // function renderLocation() {
  //   log(`Rendering Location: ${Game.getLocation()}`);
  //   Location.lookup(Game.getLocation()).render().then(rendered => {
  //     Browser.send('render.location', rendered);
  //   });
  // }
