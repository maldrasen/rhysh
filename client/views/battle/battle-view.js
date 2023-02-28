window.BattleView = (function() {

  function init() {
    X.onCodeDown(123, () => {
      return Environment.debug && MapView.isOpen() && !isOpen()
    }, debugBattleStart);
  }

  function show(state) {
    MainContent.show({ path:"client/views/battle/battle-view.html", classname:'battle' }).then(() => {
      BackgroundImage.setBackground(state.background);
      playBattleStartEffect();
    });
  }

  function isOpen() {
    return X.first('#battleView') != null;
  }

  function debugBattleStart() {
    MapCanvas.hide();
    ClientCommands.send('battle.debug-start');
  }

  function playBattleStartEffect() {
    X.addClass('#backgroundImage','battle-start');

    X.first('#fightText').innerHTML = Random.fromFrequencyMap({
      "FIGHT!":     30,
      "KILL!":      10,
      "MURDER!":    10,
      "SLAUGHTER!": 10,
      "BLOOD!":     10,
      "RAPE!":      2,
    });

    setTimeout(() => {
      X.addClass('#backgroundImage','battle-effect');
      X.addClass('#fightText','fade-out');
    },100);

    setTimeout(() => {
      X.removeClass('#backgroundImage','battle-start');
      X.removeClass('#backgroundImage','battle-effect');
      X.removeClass('#fightText','fade-out');
      X.first('#fightText').innerHTML = '';
    },1100);
  }

  return {
    init,
    show,
    isOpen,
  };

})();
