window.BattleControls = (function() {

  function init() {
    X.onClick('#actionTabs .attack-button',    selectAttackTab);
    X.onClick('#actionTabs .abilities-button', selectAbilityTab);
    X.onClick('#actionTabs .spells-button',    selectSpellTab);
    X.onClick('#actionTabs .items-button',     selectItemTab);
    X.onClick('#actionTabs .orders-button',    selectOrderTab);

    X.onClick('#attackOptions .commit-attack-button', event => {
      commitAttack();
      nextCharacter();
    });

    X.onResize(BattleView.isOpen, moveActiveCharacterGlow)
  }

  function showCharacterOrders(code) {
    BattleView.setActiveCharacterCode(code);

    let character = BattleView.getActiveCharacter();

    X.addClass('#actionTabs .orders-button','hide');
    X.addClass('#actionTabs .back-button','hide');

    X.addClass('#actionTabs .attack-button','disabled');
    X.addClass('#actionTabs .abilities-button','disabled');
    X.addClass('#actionTabs .spells-button','disabled');

    if (code == 'main') {
      X.removeClass('#actionTabs .orders-button','hide');
    }
    if (code != 'main') {
      X.removeClass('#actionTabs .back-button','hide');
    }
    if (character.mainHand) {
      X.removeClass('#actionTabs .attack-button','disabled');
    }
    if (character.abilityList.length > 0) {
      X.removeClass('#actionTabs .attack-button','disabled');
    }
    if (character.spellList.length > 0) {
      X.removeClass('#actionTabs .attack-button','disabled');
    }

    selectAttackTab();
    moveActiveCharacterGlow();
  }

  function selectAttackTab() {
    let character = BattleView.getActiveCharacter();
    let buildModeButton = (hand, mode) => {
      return X.createElement(`<a href='#${hand}:${mode}' class='button'>${TextHelper.titlecase(mode)}</a>`);
    }

    hideActionTabs();
    X.addClass('#actionTabs .attack-button','highlight');
    X.removeClass('#attackOptions','hide');

    let mainHand = character.mainHand;
    let offHand = character.offHand;

    X.first('#attackOptions .main-hand .name').innerHTML = mainHand.name;
    X.first('#attackOptions .off-hand .name').innerHTML = (offHand ? offHand.name : `<span class='empty'>(Empty)</span>`);

    let mainModes = X.first('#attackOptions .main-hand .modes');
    let offModes = X.first('#attackOptions .off-hand .modes');

    X.empty(mainModes);
    mainHand.modes.forEach(mode => {
      mainModes.appendChild(buildModeButton('main',mode));
    });

    X.empty(offModes);
    (offHand ? offHand.modes : []).forEach(mode => {
      offModes.appendChild(buildModeButton('off',mode))
    });

    let firstMain = mainModes.querySelector(':first-child');
    let firstOff = offModes.querySelector(':first-child');

    X.addClass(firstMain,'highlight');

    if (firstOff) {
      X.addClass(firstOff,'highlight');
    }
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

  function commitAttack() {
    BattleView.commitAction({
      action: 'attack',
      mainMode: '',
      offMode: '',
    });
  }

  function nextCharacter() {
    console.log("=== Next Character ===");
  }

  return {
    init,
    showCharacterOrders,
  }

})();