global.GameState = (function() {

  var $worldIndex;
  var $worldPath;

  var $timeCount;
  var $dayCount;

  var $stageName;
  var $currentBattle;
  var $currentEvent;
  var $currentZone;
  var $partyLocation;

  // Only called by the GameBuilder when starting a new game with the default
  // values.
  function init(options) {
    $timeCount = options.timeCount;
    $dayCount = options.dayCount;
    $stageName = options.stageName;
    $currentZone = options.currentZone;
    $partyLocation = options.partyLocation;
  }

  function clear() {
    $worldIndex = null;
    $worldPath = null;
    $timeCount = null;
    $dayCount = null;
    $stageName = null;
    $currentBattle = null;
    $currentEvent = null;
    $currentZone = null;
    $partyLocation = null;

    CharacterLibrary.clear();
    Flag.clear();
    Inventory.clear();
    Sector.clear();
    ZoneLibrary.clear();
  }

  function getWorldIndex() { return $worldIndex; }
  function getWorldPath() { return $worldPath; }
  function setWorldIndex(index) {
    $worldIndex = index;
    $worldPath = `${DATA}/worlds/${index}`;
  }

  // === Game Stage ============================================================

  function getStage() { return GameState.Stages[$stageName]; }
  function getStageName() { return $stageName; }
  function setStageName(stage) {
    if (GameState.Stages[stage] == null) { throw `Error: Unknown Stage "${stage}"`; }
    $stageName = stage;
  }

  // === Time and Date =========================================================

  function getTimeCount() { return $timeCount; }
  function getDayCount() { return $dayCount; }

  // TODO: Right now we're only keeping track of the time. Eventually the
  //       passage of time will trigger different events and conditions and
  //       whatnot.
  function advanceTime(ticks) {
    $timeCount += ticks;
    if ($timeCount >= RhyshCalendar.DayLength) {
      $dayCount += 1;
      $timeCount = 0;
    }
  }

  // === Events ================================================================

  function getCurrentEvent() { return $currentEvent; }
  function setCurrentEvent(event) { $currentEvent = event; }

  async function endEvent(endState) {
    let code = $currentEvent.getCode();
    let template = EventDictionary.lookup(code);
    if (template.onFinish) {
      template.onFinish(endState);
    }

    // Not sure how this will actually be used yet, but I know some events
    // should be repeatable, but not by default. { repeat:true } is the
    // simplist implementation and in this case we just don't set the flag that
    // indicates the event has been done. We can also give it a requirement of
    // some sort, something like { repeat:'flag.conditional-flag'} or anything
    // else that the scrutinizer could parse, baring in mind it has access to
    // the end event state as well.
    let canRepeat = (template.repeat == true);

    if (typeof template.repeat == 'string') {
      let scrutinizer = new Scrutinizer();
      scrutinizer.setState(endState);
      canRepeat = await scrutinizer.meetsRequirements(template.repeat);
    }

    // If an event can repeat we should keep track of the number of times it's
    // been seen. This would let us do something like play an event 10 times
    // then change it somehow.
    if (canRepeat) {
      let flag = `[EventCount].${code}`;
      let count = Flag.get(flag) || 0;
      Flag.set(flag, count + 1);
    } else {
      Flag.set(`[EventComplete].${code}`,true);
    }

    $currentEvent = null;

    GameRenderer.render();
  }

  // === Location and Zone ===

  function getCurrentZoneName() { return $currentZone; }
  function getCurrentZone() { return $currentZone ? ZoneLibrary.getCachedZone($currentZone) : null; }

  // Whenever the party moves from one zone into another we update the party
  // location to the point where they enter the zone from. The new point is
  // found in the zoneData for their current zone which should have a list of
  // places it's possible to come to the current zone from. (Or there should at
  // least be a "Default" value)
  function setCurrentZone(zoneName) {
    return new Promise(resolve => {
      ZoneLibrary.getZone(zoneName, async (zone) => {

        let previousZone = $currentZone;
        let zoneData = await zone.getZoneData();

        if (zoneData.origins.Default) { setPartyLocation(Vector.from(zoneData.origins.Default)); }
        if (zoneData.origins[previousZone]) { setPartyLocation(Vector.from(zoneData.origins[previousZone])); }

        if (getPartyLocation() == null) {
          throw `Cannot update origin. No origin point found for ${previousZone} and no default was set.`;
        }

        $currentZone = zoneName;
        resolve();
      });
    });
  }

  function getPartyLocation() { return $partyLocation; }
  function setPartyLocation(location) { $partyLocation = location; }

  // === Battle ================================================================

  function getCurrentBattle() { return $currentBattle; }

  // Setting the current battle like this bypasses setting the stage and
  // rendering the battle view. It should only be done by the specs during
  // testing. When the game is running triggerBattle() should be called.
  function setCurrentBattle(battle) { $currentBattle = battle; }


  function triggerBattle(options = {}) {
    console.log("\n=== Trigger Battle ===");
    console.log("Options:",options);

    $currentBattle = new BattleState(options);
    setStageName("Battle");

    GameRenderer.render();
  }


  return {
    init,
    clear,
    getWorldIndex,
    getWorldPath,
    setWorldIndex,

    getStage,
    getStageName,
    setStageName,

    getTimeCount,
    getDayCount,
    advanceTime,

    getCurrentEvent,
    setCurrentEvent,
    endEvent,

    getCurrentZoneName,
    getCurrentZone,
    setCurrentZone,
    getPartyLocation,
    setPartyLocation,

    getCurrentBattle,
    setCurrentBattle,
    triggerBattle,
  };

})();

GameState.Stages = {

  // Basic Views
  NewGame:        { view:"NewGame"        },
  TownBlacksmith: { view:"TownBlacksmith" },
  TownGuild:      { view:"TownGuild"      },
  TownStore:      { view:"TownStore"      },
  TownTavern:     { view:"TownTavern"     },

  // Complex Views
  Dungeon: { control:"Dungeon" },
  Battle:  { control:"Battle"  },

};
