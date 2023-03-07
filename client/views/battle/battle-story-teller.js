window.BattleStoryTeller = (function() {

  function start(events) {
    events.forEach(event => {
      console.log("Play Event:",event);
    });

    BattleView.startNewRound();
  }

  return { start }

})();
