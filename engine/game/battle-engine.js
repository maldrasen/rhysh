global.BattleEngine = class BattleEngine {

  #battleEvents;
  #initiativeOrder;
  #characterActions;

  constructor(orders) {
    this.#battleEvents = [];
    this.#initiativeOrder = {};
    this.#characterActions = {};

    ObjectHelper.each(orders.actions, (code, actionOptions) => {
      this.#characterActions[code] = new CombatAction(actionOptions);
      this.#characterActions[code].adjustForCharacter(code);
    });
  }

  execute() {
    try {
      let state = GameState.getCurrentBattle();
          state.startRound();

      this.rollForInitiative();
      this.forInitiativeOrder((segment, initiative) => {

        if (initiative.type == 'monster') {
          let monster = state.getMonster(initiative.id);
          let action = monster.chooseCombatAction();

          let round = new MonsterCombatRound(monster, action);
              round.execute();

          this.#battleEvents.push(round);
        }

        if (initiative.type == 'character') {
          let character = CharacterLibrary.getCachedCharacter(initiative.id);
          let action = this.#characterActions[initiative.id];

          let round = new CharacterCombatRound(character, action);
              round.execute();

          this.#battleEvents.push(round);
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
        add('character',character.getCode(),character.rollForInitiative());
      }
    });

    ObjectHelper.each(GameState.getCurrentBattle().getMonsters(), (id, monster) => {
      add('monster',id,monster.rollForInitiative());
    });
  }

  // === Helpers ===============================================================

  static randomSlot() {
    return Random.fromFrequencyMap({
      head:  1,
      chest: 6,
      legs:  4,
      hands: 2,
      feet:  2,
    });
  }

}