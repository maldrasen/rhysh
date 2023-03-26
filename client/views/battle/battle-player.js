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

  // === Add Battle Text =======================================================

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

  function addBattleText(event) {
    const row = X.createElement(`<div class='text-row'></div>`);

    if (event.attackRoll && event.attackBonus) {
      row.appendChild(X.createElement(`<span class='roll'>
        Roll(${event.attackRoll}) +
        Bonus(${event.attackBonus}) =
        Total(${event.attackRoll + event.attackBonus})
      </span>`));
    }
    if (event.text) {
      row.appendChild(X.createElement(`<span class='text'>${event.text}</span>`));
    }
    if (event.attackDamage > 0) {
      row.appendChild(X.createElement(`<span class='damage'>${event.attackDamage} Damage</span>`));
      applyDamage(event);
    }

    X.first('#battleText').appendChild(row);
  }

  function applyDamage(event) {
    const round = currentRound();
    if (round.target.characterCode) { PartyPanel.applyCharacterDamage(round,event); }
    if (round.target.monsterID) { Battlefield.applyMonsterDamage(round,event); }
  }

  // === Extra Text Row ========================================================

  function eventHasExtraText() {
    const event = currentEvent();
    if (event.targetCondition)  { return true; }
    if (event.conditionChanges) { return true; }
    if (event.statusChanges)    { return true; }
    return false;
  }

  function showExtraText() {
    $segment = 'extra';

    const event = currentEvent();

    if (event.targetCondition) {
      console.log("=== Target Condition:",event.targetCondition);
    }
    if (event.conditionChanges) {
      event.conditionChanges.forEach(change => {
        console.log("=== Condition Changes:",change);
        addExtraText(change.story);
      });
    }
    if (event.statusChanges) {
      event.statusChanges.forEach(change => {
        console.log("=== Status Change:",change);
        addExtraText(change.story);
      });
    }
  }

  function getExtraRowElement() {
    let extraRow = X.first('#battleText .extra-row');
    if (extraRow == null) {
      extraRow = X.createElement(`<div class='text-row'></div>`);
      X.first('#battleText').appendChild(extraRow);
    }
    return extraRow;
  }

  function addExtraText(text) {
    const row = getExtraRowElement();
    row.appendChild(X.createElement(`<span class='extra'>${text}</span>`));
  }

  // ===========================================================================


  return { init, reset, start };

})();
