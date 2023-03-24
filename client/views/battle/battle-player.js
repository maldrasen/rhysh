window.BattlePlayer = (function() {

  let $battleRounds;
  let $battleRoundIndex;
  let $combatEventIndex;
  let $segment;

  function init() {
    X.onClick('#clickAdvance', clickAdvance);
  }

  function reset() {
    $battleRounds = null;
    $battleRoundIndex = null;
    $segment = null;
  }

  function start(rounds) {
    $battleRounds = rounds;
    $battleRoundIndex = 0;
    $combatEventIndex = 0;

    X.removeClass('#clickAdvance','hide');
    X.removeClass('#battleText','hide');
    X.addClass('#activeCharacterGlow','hide');

    showActionText();
  }

  function stop() {
    X.addClass('#clickAdvance','hide');
    X.addClass('#battleText','hide');
    X.removeClass('#activeCharacterGlow','hide');

    BattleView.startNewRound();
  }

  function currentRound() { return $battleRounds[$battleRoundIndex]; }

  function currentEvent() {
    if (currentRound() && currentRound().combatEvents) {
      return currentRound().combatEvents[$combatEventIndex];
    }
  }

  function clickAdvance() {
    if (BattleView.isOpen() == false) { return; }
    if (currentRound() == null) { return stop(); }

    if (currentRound().combatEvents == null) {
      throw 'TODO: Handle a combat round with no combat events.';
    }

    if (currentEvent()) {
      if ($segment == 'action') { return showResultText(); }
      if ($segment == 'result' && eventHasExtraText()) { return showExtraText(); }

      X.empty('#battleText');
      advanceEvent();

      return (currentEvent() == null) ? stop() : showActionText();
    }
  }

  function advanceEvent() {
    $combatEventIndex += 1;
    if ($combatEventIndex >= currentRound().combatEvents.length) {
      $combatEventIndex = 0;
      $battleRoundIndex += 1;
    }
  }

  function showActionText() {
    $segment = 'action';

    let event = currentEvent();
    addBattleText({ text:event.actionStory });
  }

  function showResultText() {
    $segment = 'result';

    let event = currentEvent();
    addBattleText({ ...event, text:event.resultStory });
  }

  function showExtraText() {
    $segment = 'extra';

  }

  function addBattleText(segment) {
    let item = X.createElement(`<div></div>`);

    if (segment.attackRoll && segment.attackBonus) {
      item.appendChild(X.createElement(`<span class='roll'>
        Roll(${segment.attackRoll}) +
        Bonus(${segment.attackBonus}) =
        Total(${segment.attackRoll + segment.attackBonus})
      </span>`));
    }
    if (segment.text) {
      item.appendChild(X.createElement(`<span class='text'>${segment.text}</span>`));
    }
    if (segment.damage) {
      console.log("DAMAGE:",segment.damage);
    //   item.appendChild(X.createElement(`<span class='damage'>${segment.damage} Damage</span>`));
    }

    X.first('#battleText').appendChild(item);
  }


  function eventHasExtraText() {
    return false;
  }

  // function applyDamage(segment) {
  //   if (segment.damage > 0) {
  //     if (segment.targetClassname.match(/character/)) { PartyPanel.applyCharacterDamage(segment) }
  //     if (segment.targetClassname.match(/monster/)) { applyMonsterDamage(segment) }
  //     console.log("Apply Damage from:",segment)
  //   }
  // }

  // function applyMonsterDamage(segment) {
  //   console.log("Apply Monster Damage from:",segment)
  // }

  return { init, reset, start };

})();
