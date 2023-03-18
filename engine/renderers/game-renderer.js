global.GameRenderer = (function() {

  function render() {
    let event = GameState.getCurrentEvent();
    let stage = GameState.getStage();

    if (event) { return renderEvent(event); }
    if (stage.view) { return renderView(stage); }
    if (stage.control == "Dungeon") { return renderDungeon(); }
    if (stage.control == "Battle")  { return renderBattle();  }
  }

  function renderEvent(event) {
    Switchboard.render({
      showView: "Event",
      event: new EventRenderer(event).render(),
      status: getStatus(),
    });
  }

  function renderView(stage) {
    Switchboard.render({
      showView: stage.view,
      status: getStatus(),
    });
  }

  function renderBattle() {
    Switchboard.render({
      showView: "Battle",
      background: ImageData.pickBattleBackground(),
      battle: GameState.getCurrentBattle().pack(),
      status: getStatus(),
    });
  }

  function renderDungeon() {
    ZoneLibrary.getZone(GameState.getCurrentZoneCode(), zone => {
      Switchboard.render({
        showView: "Dungeon",
        zone: zone.forClient(),
        location: GameState.getPartyLocation(),
        status: getStatus(),
      });
    });
  }

  function getStatus() {
    let worldIndex = GameState.getWorldIndex();
    let main = CharacterLibrary.getMainCharacter();
    let zone = GameState.getCurrentZone();
    let timeCount = GameState.getTimeCount();
    let dayCount = GameState.getDayCount();

    let party = {};
    if (main) {
      party.main = main.packForStatus();
    }

    return {
      worldIndex: worldIndex,
      timeCount: timeCount,
      timeOfDay: RhyshCalendar.getTimeOfDay(timeCount),
      dayCount: dayCount,
      dayName: RhyshCalendar.getDayName(dayCount),
      party: party,
      location: zone ? zone.name : '',
    };
  }

  return { render };

})();
