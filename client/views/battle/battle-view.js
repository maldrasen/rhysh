window.BattleView = (function() {

  let $battleState;
  let $activeCharacterCode;
  let $activeCharacter;
  let $committedActions;

  function init() {
    X.onCodeDown(123, () => {
      return Environment.debug && MapView.isOpen() && !isOpen()
    }, debugBattleStart);

    ServerEvents.onRenderBattleRound((payload, data) => {
      console.log("Current State:",data.battle)
      $battleState = data.battle;
      BattlePlayer.start(data.combatRounds);
    });
  }

  function reset() {
    $battleState = null;
    $activeCharacterCode = null;
    $activeCharacter = null;
    $committedActions = null;
  }

  function show(state) {
    $battleState = state.battle;

    PartyPanel.show(state.status);
    MainContent.show({ path:"client/views/battle/battle-view.html", classname:'battle' }).then(() => {
      BackgroundImage.setBackground(state.background);
      Battlefield.buildMonsterCards();
      BattleControls.startControlPhase();
      BattleEffects.playBattleStartEffect();
    });
  }

  function isOpen() {
    return X.first('#battleView') != null;
  }

  function getBattleState() { return $battleState; }

  function startNewRound() {
    Battlefield.updateMonsterCards();
    BattleControls.startControlPhase();
  }

  function getActiveCharacterCode() { return $activeCharacterCode; }
  function getActiveCharacter() { return $activeCharacter; }
  function setActiveCharacterCode(code) {
    $activeCharacterCode = code
    $activeCharacter = $battleState.party[$activeCharacterCode];
  }

  function getCommittedAction(code) { return $committedActions[code]; }
  function getCommittedActions() { return $committedActions; }
  function clearCommittedActions() { $committedActions = {}; }
  function commitAction(action) {
    $committedActions[$activeCharacter.code] = action;
  }

  function debugBattleStart() {
    MapCanvas.hide();
    ClientCommands.send('battle.debug-start');
  }

  return {
    init,
    reset,
    show,
    isOpen,

    getBattleState,
    startNewRound,

    getActiveCharacterCode,
    getActiveCharacter,
    setActiveCharacterCode,

    getCommittedAction,
    getCommittedActions,
    clearCommittedActions,
    commitAction,
  };

})();
