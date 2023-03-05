global.BattleEngine = class BattleEngine {

  #battleEvents;
  #initiativeOrder;
  #characterActions;

  constructor(orders) {
    this.#battleEvents = [];
    this.#initiativeOrder = {};
    this.#characterActions = orders.actions;
  }

  execute() {
    let state = GameState.getCurrentBattle();
    state.startRound();

    this.rollForInitiative();
    this.forInitiativeOrder((segment, initiative) => {
      console.log("Segment:",segment);
      if (initiative.type == 'monster') {
        let monster = state.getMonster(initiative.id);
        let action = monster.chooseCombatAction();
        console.log("  Monster:",initiative.id,monster.getName());
        console.log("  Action:",action)
      }

      // TODO: Some actions that characters take will increase threat across
      //       all monsters. Actions like healing and area of effect spells
      //       especially.
      //
      if (initiative.type == 'character') {
        let character = CharacterLibrary.getCachedCharacter(initiative.id);
        let action = this.#characterActions[initiative.id];
        console.log("  Character:",character.getFullName());
        console.log("  Action:",action)
      }
    });

    state.endRound();

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

}