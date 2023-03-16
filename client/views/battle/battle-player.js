window.BattlePlayer = (function() {

  let $eventList;
  let $eventIndex;
  let $segmentIndex;

  function init() {
    X.onClick('#clickAdvance', clickAdvance);
  }

  function start(events) {
    $eventList = events;
    $eventIndex = 0;
    $segmentIndex = 0;

    X.removeClass('#clickAdvance','hide');
    X.removeClass('#battleText','hide');

    addBattleText();
  }

  function stop() {
    console.log("No more events. Start Next Round");


    X.addClass('#clickAdvance','hide');
    X.addClass('#battleText','hide');

    BattleView.startNewRound();
  }


  function currentEvent() { return $eventList[$eventIndex]; }
  function currentSegment() { return currentEvent() ? currentEvent().segments[$segmentIndex] : null; }

  function clickAdvance() {
    if (BattleView.isOpen()) {
      advanceSegment();
      addBattleText();
    }
  }

  function advanceSegment() {
    $segmentIndex += 1;

    if ($segmentIndex >= currentEvent().segments.length) {
      X.empty('#battleText');
      $segmentIndex = 0;
      $eventIndex += 1;
    }
  }

  function addBattleText() {
    let event = currentEvent();
    if (event == null) { stop(); }

    let segment = currentSegment();
    if (segment == null) { return; }

    let item = X.createElement(`<div class='${segment.type}'></div>`);

    if (segment.attackRoll) {
      item.appendChild(X.createElement(`<span class='roll'>(Roll ${segment.attackRoll})</span>`));
    }
    if (segment.text) {
      let severityClass = segment.severity ? `severity-${segment.severity}` : ''
      item.appendChild(X.createElement(`<span class='text ${severityClass}'>${segment.text}</span>`));
    }
    if (segment.damage) {
      item.appendChild(X.createElement(`<span class='damage'>${segment.damage} Damage</span>`));
    }

    X.first('#battleText').appendChild(item);
  }

  return { init, start }

})();
