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
    state.endRound();

    return this.#battleEvents;
  }

  getInitiativeOrder() { return this.#initiativeOrder; }

  rollForInitiative() {
    ObjectHelper.each(CharacterLibrary.getParty(), (position, character) => {
      if (character) {
        console.log("Roll for Character:",character.getCode());
      }
    });

    ObjectHelper.each(GameState.getCurrentBattle().getMonsters(), (id, monster) => {
      console.log("Roll for Monster:",id,monster.getName());
    });
  }

}