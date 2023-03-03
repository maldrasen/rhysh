window.BattleView = (function() {

  var $battleState;
  var $activeCharacterCode;
  var $activeCharacter;

  function init() {
    X.onClick('#actionTabs .attack-button',selectAttackTab);
    X.onClick('#actionTabs .abilities-button',selectAbilityTab);
    X.onClick('#actionTabs .spells-button',selectSpellTab);
    X.onClick('#actionTabs .items-button',selectItemTab);
    X.onClick('#actionTabs .orders-button',selectOrderTab);

    X.onCodeDown(123, () => {
      return Environment.debug && MapView.isOpen() && !isOpen()
    }, debugBattleStart);

    X.onResize(isOpen, moveActiveCharacterGlow)
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
    $activeCharacterCode = code;
    $activeCharacter = $battleState.party[$activeCharacterCode];

    X.addClass('#actionTabs .orders-button','hide');
    X.addClass('#actionTabs .back-button','hide');

    X.addClass('#actionTabs .attack-button','disabled');
    X.addClass('#actionTabs .abilities-button','disabled');
    X.addClass('#actionTabs .spells-button','disabled');

    if ($activeCharacterCode == 'main') {
      X.removeClass('#actionTabs .orders-button','hide');
    }
    if ($activeCharacterCode != 'main') {
      X.removeClass('#actionTabs .back-button','hide');
    }
    if ($activeCharacter.mainHand) {
      X.removeClass('#actionTabs .attack-button','disabled');
    }
    if ($activeCharacter.abilityList.length > 0) {
      X.removeClass('#actionTabs .attack-button','disabled');
    }
    if ($activeCharacter.spellList.length > 0) {
      X.removeClass('#actionTabs .attack-button','disabled');
    }

    selectAttackTab();
    moveActiveCharacterGlow();
  }

  function selectAttackTab() {
    hideActionTabs();
    X.addClass('#actionTabs .attack-button','highlight');
    X.removeClass('#attackOptions','hide');
  }

  function selectAbilityTab() {
    hideActionTabs();
    X.addClass('#actionTabs .abilities-button','highlight');
    X.removeClass('#abilityOptions','hide');
  }

  function selectSpellTab() {
    hideActionTabs();
    X.addClass('#actionTabs .spells-button','highlight');
    X.removeClass('#spellOptions','hide');
  }

  function selectItemTab() {
    hideActionTabs();
    X.addClass('#actionTabs .items-button','highlight');
    X.removeClass('#itemOptions','hide');
  }

  function selectOrderTab() {
    hideActionTabs();
    X.addClass('#actionTabs .orders-button','highlight');
    X.removeClass('#orderOptions','hide');
  }

  function hideActionTabs() {
    X.removeClass('#actionTabs .highlight','highlight');
    X.addClass('#attackOptions','hide');
    X.addClass('#abilityOptions','hide');
    X.addClass('#spellOptions','hide');
    X.addClass('#itemOptions','hide');
    X.addClass('#orderOptions','hide');
  }

  function moveActiveCharacterGlow(code) {
    let portrait = X.first('#partyPanel .main-character');
    let position = X.getPosition(portrait);
    let glow = X.first('#activeCharacterGlow');

    glow.style['top'] = `${position.top}px`;
    glow.style['left'] = `${position.left}px`;
    glow.style['height'] = `${position.height}px`;
    glow.style['width'] = `${position.width}px`;
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
