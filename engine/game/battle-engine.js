global.BattleEngine = class BattleEngine {

  #battleEvents;
  #initiativeOrder;
  #characterActions;

  constructor(orders) {
    this.#battleEvents = [];
    this.#initiativeOrder = {};
    this.#characterActions = {};

    ObjectHelper.each(orders.actions, (code, actionOptions) => {
      this.#characterActions[code] = this.buildCharacterCombatAction(code, actionOptions);
    });
  }

  execute() {
    try {
      let state = GameState.getCurrentBattle();
          state.startRound();

      this.rollForInitiative();
      this.forInitiativeOrder((segment, initiative) => {

        if (initiative.type == _monsterInitiative) {
          let monster = state.getMonster(initiative.id);
          let action = MonsterAI.chooseCombatAction(monster);

          // let round = new MonsterCombatRound(monster, action);
          //     round.execute();

          this.#battleEvents.push({
            actorType: _monsterActor,
            action: action,
            result: null,
          });
        }

        if (initiative.type == _characterInitiative) {
          let character = CharacterLibrary.getCachedCharacter(initiative.id);
          let action = this.#characterActions[initiative.id];

          // let round = new CharacterCombatRound(character, action);
          //     round.execute();

          this.#battleEvents.push({
            actorType: _characterActor,
            action: action,
            result: null,
          });
        }
      });

      state.endRound();
    }
    catch(error) {
      console.error("=== Battle Engine Error ===")
      console.error(error);
    }

    return this.#battleEvents;
  }

  // === Initiative ============================================================

  getInitiativeOrder() { return this.#initiativeOrder; }

  getInitiativeSegments() {
    return Object.keys(this.#initiativeOrder).sort((a,b) => {
      return parseInt(b) - parseInt(a)
    });
  }

  forInitiativeOrder(callback) {
    this.getInitiativeSegments().forEach(segment => {
      this.#initiativeOrder[segment].forEach(initiative => {
        callback(segment, initiative);
      });
    });
  }

  rollForInitiative() {
    let add = (type, id, roll) => {
      if (this.#initiativeOrder[roll] == null) { this.#initiativeOrder[roll] = []; }
      this.#initiativeOrder[roll].push({ type:type, id:id });
    }

    ObjectHelper.each(CharacterLibrary.getParty(), (position, character) => {
      if (character) {
        add(_characterInitiative,character.getCode(),character.rollForInitiative());
      }
    });

    ObjectHelper.each(GameState.getCurrentBattle().getMonsters(), (id, monster) => {
      add(_monsterInitiative,id,monster.rollForInitiative());
    });
  }

  // ===========================================================================

  // Build a CombatAction for the character and make any character specific
  // adjustments needed for the action. When a character is attacking with a
  // short range weapon they don't need to specify that they're targeting the
  // front rank, but the battle engine does need to know that.
  buildCharacterCombatAction(code, actionOptions) {
    let combatAction = new CombatAction({
      actorClassname: _characterActor,
      actorItentifier: code,
      ...actionOptions,
    });

    let character = CharacterLibrary.getCachedCharacter(code);
    let mainHand = character.getMainHand();
    let offHand = character.getOffHand();

    if (combatAction.isAttack()) {
      if (combatAction.getTargetType() == null) { combatAction.setTargetType(_rank); }
      if (combatAction.getTargetRank() == null) { combatAction.setTargetRank(_rank_1); }

      if (combatAction.getMainMode() == 'random') {
        combatAction.setMainMode((mainHand && mainHand.isWeapon()) ? Random.from(mainHand.getModes()) : null);
      }
      if (combatAction.getOffMode() == 'random') {
        combatAction.setOffMode((offHand && offHand.isWeapon()) ? Random.from(offHand.getModes()) : null);
      }
    }

    return combatAction;
  }

}