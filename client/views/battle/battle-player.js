window.BattlePlayer = (function() {

  let $eventList;
  let $eventIndex;
  let $segmentIndex;

  function init() {
    X.onClick('#clickAdvance', clickAdvance);
  }

  function reset() {
    $eventList = null;
    $eventIndex = null;
    $segmentIndex = null;
  }

  function start(events) {
    $eventList = events;
    $eventIndex = 0;
    $segmentIndex = 0;

    X.removeClass('#clickAdvance','hide');
    X.removeClass('#battleText','hide');
    X.addClass('#activeCharacterGlow','hide');

    addBattleText(currentSegment());
  }

  function stop() {
    X.addClass('#clickAdvance','hide');
    X.addClass('#battleText','hide');
    X.removeClass('#activeCharacterGlow','hide');

    BattleView.startNewRound();
  }

  function currentEvent() { return $eventList[$eventIndex]; }
  function currentSegment() { return currentEvent() ? currentEvent().segments[$segmentIndex] : null; }

  function clickAdvance() {
    if (BattleView.isOpen()) {
      advanceSegment();

      if (currentEvent() == null) { return stop(); }

      let segment = currentSegment();
      if (segment) {
        addBattleText(segment);
        applyDamage(segment);
      }
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

  function addBattleText(segment) {
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

  function applyDamage(segment) {
    if (segment.damage > 0) {
      if (segment.targetClassname.match(/character/)) { PartyPanel.applyCharacterDamage(segment) }
      if (segment.targetClassname.match(/monster/)) { applyMonsterDamage(segment) }
      console.log("Apply Damage from:",segment)
    }
  }

  function applyMonsterDamage(segment) {
    console.log("Apply Monster Damage from:",segment)
  }

  return { init, reset, start };

})();
