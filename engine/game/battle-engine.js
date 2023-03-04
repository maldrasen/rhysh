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
      console.log(segment, initiative);
    })

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