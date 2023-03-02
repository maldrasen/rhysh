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
      status: getStatus(),
      background: ImageDictionary.pickBattleBackground(),
      battle: GameState.getCurrentBattle().pack(),
    });
  }

  function renderDungeon() {
    ZoneLibrary.getZone(GameState.getCurrentZoneName(), zone => {
      Messenger.publish("browser.render", {
        showView: "Dungeon",
        status: getStatus(),
        zone: zone.forClient(),
        location: GameState.getPartyLocation(),
      });
    });
  }

  function getStatus() {
    let main = CharacterLibrary.getMainCharacter();
    let zone = GameState.getCurrentZone();
    let timeCount = GameState.getTimeCount();
    let dayCount = GameState.getDayCount();

    let party = {};
    if (main) {
      party.main = main.packForStatus();
    }

    return {
      timeCount: timeCount,
      timeOfDay: RhyshCalendar.getTimeOfDay(timeCount),
      dayCount: dayCount,
      dayName: RhyshCalendar.getDayName(dayCount),
      party: party,
      location: zone ? zone.getDisplayName() : '',
    };
  }

  return { render };

})();
