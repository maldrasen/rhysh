window.BattlePlayer = (function() {

  let $eventList;
  let $eventIndex;

  function init() {
    X.onClick('#clickAdvance', clickAdvance);
  }

  function start(events) {
    $eventList = events;
    $eventIndex = 0;

    X.removeClass('#clickAdvance','hide');

    console.log("Play Events",events);
    // events.forEach(event => {
    //   console.log("Play Event:",event);
    // });

    // BattleView.startNewRound();
  }

  function currentEvent() {
    return $eventList[$eventIndex];
  }

  function clickAdvance() {
    if (BattleView.isOpen()) {
      console.log("Click Advance.")
    }
  }

  return { init, start }

})();
