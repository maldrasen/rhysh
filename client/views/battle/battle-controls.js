window.BattleControls = (function() {

  let $selectedAbility;

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

    X.onClick('#abilityOptions .commit-ability-button', event => {
      commitAbility();
      nextCharacter();
    })

    X.onResize(BattleView.isOpen, moveActiveCharacterGlow)
  }

  function reset() {
    $selectedAbility = null;
  }

  function startControlPhase() {
    BattleView.clearCommittedActions();
    showCharacterOrders('main');
  }

  function showCharacterOrders(code) {
    BattleView.setActiveCharacterCode(code);

    let character = BattleView.getActiveCharacter();

    X.removeClass('#actionTabs','hide');
    X.addClass('#actionTabs .orders-button','hide');

    X.addClass('#actionTabs .attack-button','disabled');
    X.addClass('#actionTabs .abilities-button','disabled');
    X.addClass('#actionTabs .spells-button','disabled');

    if (code == 'main') {
      X.removeClass('#actionTabs .orders-button','hide');
    }
    if (character.mainHand) {
      X.removeClass('#actionTabs .attack-button','disabled');
    }
    if (character.abilityList.length > 0) {
      X.removeClass('#actionTabs .abilities-button','disabled');
    }
    if (character.spellList.length > 0) {
      X.removeClass('#actionTabs .spells-button','disabled');
    }

    buildAttackTab();
    buildAbilitiesTab();

    selectAttackTab();
    moveActiveCharacterGlow();
  }


  // === Selecting =============================================================

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

  // === Building ==============================================================

  function buildModeButton(hand, mode) {
    let button = X.createElement(`<a class='button'>${TextHelper.titlecase(mode)}</a>`);

    button.setAttribute('data-hand',hand);
    button.setAttribute('data-mode',mode);
    button.addEventListener('click', event => {
      X.removeClass(event.target.closest('.weapon').querySelector('.highlight'),'highlight');
      X.addClass(event.target,'highlight');
    });

    return button;
  }

  function buildAttackTab() {
    let character = BattleView.getActiveCharacter();

    let mainHand = character.mainHand;
    let mainModes = X.first('#attackOptions .main-hand .modes');

    let offHand = character.offHand;
    let offModes = X.first('#attackOptions .off-hand .modes');
    let offHandName = offHand ? offHand.name : `<span class='empty'>(Empty)</span>`;

    X.empty(mainModes);
    X.empty(offModes);
    X.first('#attackOptions .main-hand .name').innerHTML = mainHand.name;
    X.first('#attackOptions .off-hand .name').innerHTML = offHandName;

    mainHand.modes.forEach(mode => {
      mainModes.appendChild(buildModeButton('main',mode));
    });

    (offHand ? offHand.modes : []).forEach(mode => {
      offModes.appendChild(buildModeButton('off',mode))
    });

    let firstMain = mainModes.querySelector(':first-child');
    let firstOff = offModes.querySelector(':first-child');

    if (firstMain) { X.addClass(firstMain,'highlight'); }
    if (firstOff)  { X.addClass(firstOff,'highlight'); }
  }

  function buildAbilitiesTab() {
    $selectedAbility = null;

    let character = BattleView.getActiveCharacter();
    let listElement = X.first('#abilityOptions .ability-list');

    X.addClass('#abilityOptions .commit-ability-button','disabled');

    listElement.innerHTML = '';
    character.abilityList.forEach(ability => {
      listElement.appendChild(buildAbilityButton(ability));
    });
  }

  function buildAbilityButton(ability) {
    let element = X.createElement(`<a href='#' class='ability-button'></a>`);
        element.style['background-image'] = `url(${ability.icon})`;

    element.addEventListener('click', event => {
      X.removeClass('#abilityOptions .commit-ability-button','disabled');
      X.removeClass('#abilityOptions .highlight','highlight');
      X.addClass(element, 'highlight');

      $selectedAbility = ability;
    });

    return element;
  }

  // ===========================================================================

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
    let main = X.first('#attackOptions .main-hand .highlight');
    let off = X.first('#attackOptions .off-hand .highlight');
    let mainMode = main ? main.getAttribute('data-mode') : null;
    let offMode = off ? off.getAttribute('data-mode') : null;

    BattleView.commitAction({
      action: 'attack',
      mainMode: mainMode,
      offMode: offMode,
    });
  }

  // TODO: Still not handling setting the target, but I think we're going to be
  //       redoing this view entirely anyway, so no point in doing that now. If
  //       an ability requires a target, just always assume rank_1 for now.
  function commitAbility() {
    BattleView.commitAction({
      action: 'ability',
      ability: $selectedAbility.code,
    });
  }

  function nextCharacter() {
    let state = BattleView.getBattleState();
    let allComplete = true;

    ObjectHelper.each(state.party, (code, character) => {
      if (character != null && BattleView.getCommittedAction(character.code) == null) {
        allComplete = false;
      }
    });

    if (allComplete) {
      return showConfirm();
    }

    // TODO: Show next character.
  }

  // TODO: Right now, there's only the main character. We'll need to figure out
  //       how to properly traverse the party object as this uses the actual
  //       character codes when we actually implement this.
  function goBack() {
    showCharacterOrders('main');
  }

  function showConfirm() {
    hideActionTabs();
    X.addClass('#actionTabs','hide');

    let confirmed = () => {
      ClientCommands.send('battle.start-round', {
        actions: BattleView.getCommittedActions(),
      });
    };

    Confirmation.show({
      text: "Start Round?",
      onConfirm: confirmed,
      onCancel: goBack,
    });
  }

  return {
    init,
    reset,
    startControlPhase,
  }

})();