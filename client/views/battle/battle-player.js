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

  function addBattleText(event) {
    const item = X.createElement(`<div></div>`);

    if (event.attackRoll && event.attackBonus) {
      item.appendChild(X.createElement(`<span class='roll'>
        Roll(${event.attackRoll}) +
        Bonus(${event.attackBonus}) =
        Total(${event.attackRoll + event.attackBonus})
      </span>`));
    }
    if (event.text) {
      item.appendChild(X.createElement(`<span class='text'>${event.text}</span>`));
    }
    if (event.attackDamage > 0) {
      item.appendChild(X.createElement(`<span class='damage'>${event.attackDamage} Damage</span>`));
      applyDamage(event);
    }

    X.first('#battleText').appendChild(item);
  }

  function eventHasExtraText() {
    const event = currentEvent();


    console.log("Has Extra?",event);

    if (event.statusChanges) {
      console.log("=== YES:",event.statusChanges)
    }
    return false;
  }

  function applyDamage(event) {
    const round = currentRound()
    if (round.target.characterCode) { PartyPanel.applyCharacterDamage(round,event) }
    if (round.target.monsterID) { applyMonsterDamage(event) }
  }

  function applyMonsterDamage(event) {
    console.log("Apply Monster Damage from:",event)
  }

  return { init, reset, start };

})();
