window.BattleView = (function() {

  var $battleState;

  function init() {
    X.onCodeDown(123, () => {
      return Environment.debug && MapView.isOpen() && !isOpen()
    }, debugBattleStart);
  }

  function show(state) {
    $battleState = state.battle;

    PartyPanel.show(state.status);
    MainContent.show({ path:"client/views/battle/battle-view.html", classname:'battle' }).then(() => {
      BackgroundImage.setBackground(state.background);
      showCharacterOrders('main');
      updateMonsterList();
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

  function showCharacterOrders(code) {
    let character = $battleState.party[code];

    X.removeClass('#characterOrders','hide');
    X.addClass('#characterOrders .orders-button','hide');
    X.addClass('#characterOrders .back-button','hide');

    X.addClass('#characterOrders .attack-button','disabled');
    X.addClass('#characterOrders .abilities-button','disabled');
    X.addClass('#characterOrders .spells-button','disabled');

    if (code == 'main') {
      X.removeClass('#characterOrders .orders-button','hide');
    }
    if (code != 'main') {
      X.removeClass('#characterOrders .back-button','hide');
    }
    if (character.mainHand) {
      X.removeClass('#characterOrders .attack-button','disabled');
    }
    if (character.abilityList.length > 0) {
      X.removeClass('#characterOrders .attack-button','disabled');
    }
    if (character.spellList.length > 0) {
      X.removeClass('#characterOrders .attack-button','disabled');
    }

    console.log(character);
  }

  function updateMonsterList() {
    forUpTo(5, i => {
      let rank = i+1;
      let listElement = X.first(`#targetFrame .rank-${rank}`);
      let fieldElement = X.first(`#battlefield .rank-${rank}`);

      let squad = $battleState.monsters[rank];

      X.empty(listElement);
      X.empty(fieldElement);
      X.addClass(listElement,'empty');

      if (squad) {
        X.removeClass(listElement,'empty');
        listElement.innerHTML = `<span class='count'>${squad.monsters.length}</span> ${squad.name}`;

        squad.monsters.forEach(monster => {
          fieldElement.appendChild(buildMonsterCard(monster))
        });
      }
    });
  }

  function buildMonsterCard(monster) {
    console.log("Build:",monster)

    let monsterCard = X.createElement(`
      <div class='monster-card'>
        <div class='name'>${monster.name}</div>
      </div>`);
    return monsterCard;
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
