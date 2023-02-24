global.GameRenderer = (function() {

  function render() {
    let event = GameState.getCurrentEvent();
    let stage = GameState.getStage();

    if (event) { return renderEvent(event); }
    if (stage.view) { return renderView(stage); }
    if (stage.control == "Dungeon") { return renderDungeon(); }
    if (stage.control == "Battle")  { return renderBattle();  }
  }

  async function renderEvent(event) {
    let renderer = new EventRenderer(event);

    Messenger.publish("browser.render",{
      showView: "Event",
      event: await renderer.render(),
    });
  }

  function renderView(stage) {
    Messenger.publish("browser.render",{
      showView: stage.view,
      status: getStatus(),
    });
  }

  function renderBattle() {
    Messenger.publish("browser.render", {
      showView: "Battle",
      battle: GameState.getCurrentBattle().pack(),
    });
  }

  function renderDungeon() {
    Dungeon.getZone(GameState.getCurrentZoneName(), zone => {
      Messenger.publish("browser.render", {
        showView: "Dungeon",
        zone: zone.forClient(),
        location: GameState.getPartyLocation(),
        status: getStatus(),
      });
    });
  }

  function getStatus() {
    let timeCount = GameState.getTimeCount();
    let dayCount = GameState.getDayCount();

    return {
      timeCount: timeCount,
      timeOfDay: RhyshCalendar.getTimeOfDay(timeCount),
      dayCount: dayCount,
      dayName: RhyshCalendar.getDayName(dayCount),
    };
  }

  return { render };

})();
