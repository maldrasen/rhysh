window.BattleView = (function() {

  function init() {
    X.onCodeDown(123, () => {
      return Environment.debug && MapView.isOpen() && !isOpen()
    }, debugBattleStart);
  }

  function show(state) {
    MainContent.show({ path:"client/views/battle/battle-view.html", classname:'battle' }).then(() => {
      console.log("TODO: Build Battle View");
    });
  }

  function isOpen() {
    return X.first('#battleView') != null;
  }

  function debugBattleStart() {
    MapCanvas.hide();
    ClientCommands.send('battle.debug-start');
  }

  return {
    init,
    show,
    isOpen,
  };

})();