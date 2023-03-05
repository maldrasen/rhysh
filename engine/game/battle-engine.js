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

    // TODO: Reduce all cooldowns by one, and remove at 0.

    this.rollForInitiative();
    this.forInitiativeOrder((segment, initiative) => {

      if (initiative.type == 'monster') {
        let monster = state.getMonster(initiative.id);
        let action = monster.chooseCombatAction();

        if (action.action == 'attack') { this.doMonsterAttack(monster); }
        if (action.action == 'ability') { this.doMonsterAbility(monster, action.ability); }
      }

      // TODO: Some actions that characters take will increase threat across
      //       all monsters. Actions like healing and area of effect spells
      //       especially.
      //
      if (initiative.type == 'character') {
        let character = CharacterLibrary.getCachedCharacter(initiative.id);
        let action = this.#characterActions[initiative.id];
        // console.log("  Character:",character.getFullName());
        // console.log("  Action:",action)
      }
    });

    state.endRound();

    return this.#battleEvents;
  }

  doMonsterAttack(monster) {
    // console.log("...do attack");
  }

  doMonsterAbility(monster, ability) {
    let template = AbilityDictionary.lookup(ability.code);

    // console.log("Do ability: ",ability);
    monster.useAbility(ability.code);

    if (template.type == 'attack') {
      let target = CharacterLibrary.getCachedCharacter(monster.getTarget());
      let targetSlot = template.targetSlot || BattleEngine.randomSlot();
      let hitRoll = Random.rollDice({ d:20 }) + monster.getBaseHit() + (ability.hit || 0);

      // console.log("  Target:",target);
      // console.log("  Target Slot:",targetSlot);
      // console.log("  Hit Roll:",hitRoll);
    }

    // TODO: Template type: grapple
    // TODO: Template type: hold
    // TODO: Template type: coup-de-grace
    // TODO: Other types too of course.

    // TODO: Calculate damage from ability.damage

    // TODO: Handle setting status and conditions.
    //   if (template.setCondition) {
    //     this.#condition.setCondition(template.setCondition.condition)
    //   }

    // TODO: We then need to pick a story, weave the story text. Possibly add
    //       bonus damage.

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