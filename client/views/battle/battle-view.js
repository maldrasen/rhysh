window.BattleView = (function() {

  let $battleState;
  let $activeCharacterCode;
  let $activeCharacter;
  let $committedActions;

  function init() {
    X.onCodeDown(123, () => {
      return Environment.debug && MapView.isOpen() && !isOpen()
    }, debugBattleStart);
  }

  function show(state) {
    $battleState = state.battle;
    $committedActions = {};

    PartyPanel.show(state.status);
    MainContent.show({ path:"client/views/battle/battle-view.html", classname:'battle' }).then(() => {
      BackgroundImage.setBackground(state.background);
      BattleControls.showCharacterOrders('main');
      Battlefield.updateMonsterList();
      BattleEffects.playBattleStartEffect();
    });
  }

  function isOpen() {
    return X.first('#battleView') != null;
  }

  function getBattleState() { return $battleState; }
  function getActiveCharacterCode() { return $activeCharacterCode; }
  function getActiveCharacter() { return $activeCharacter; }

  function setActiveCharacterCode(code) {
    $activeCharacterCode = code
    $activeCharacter = $battleState.party[$activeCharacterCode];
  }

  function commitAction(action) {
    $committedActions[$activeCharacter.code] = action;
  }

  function debugBattleStart() {
    MapCanvas.hide();
    ClientCommands.send('battle.debug-start');
  }

  return {
    init,
    show,
    isOpen,
    getBattleState,
    getActiveCharacterCode,
    getActiveCharacter,
    setActiveCharacterCode,
    commitAction,
  };

})();
