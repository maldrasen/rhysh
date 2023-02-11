global.EventQueue = (function() {

  // The event queue is for events that have specific requirements that have to
  // be met before they can trigger. At least that's how they worked in
  // previous iterations of this game. Other than imediate events that are set
  // directly in the GameState, I think most events in the game will be
  // triggered by the party's location. Those are really just imeadiete events
  // too actually.
  //
  // I can think of a few examples where we might need a queue. When an event
  // starts a battle and once the battle is over we display an event. Are there
  // events inside of a battle, triggered when an enemy get's to low health?
  // Maybe, that's an interesting idea, but not a queued event, something else
  // entirely. Something worth thinking about before I blindly copy paste this
  // from the previous version though.

  var eventQueue = [];

  function clear() {
    currentEvent = null;
    eventQueue = [];
  }

  function addEvent(event) {
    eventQueue.push(event);
  }

  function save() {
    console.log("TODO: Save Event Queue")
  }

  function load() {
    console.log("TODO: Load Event Queue")
  }

  return {
    clear,
    addEvent,
    save,
    load,
  }

})();
