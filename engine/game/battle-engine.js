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
    try {
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
    }
    catch(error) {
      console.error("=== Battle Engine Error ===")
      console.error(error);
    }

    return this.#battleEvents;
  }

  doMonsterAttack(monster) {
    // console.log("...do attack");
  }

  // TODO: Some abilities won't have a target.
  // TODO: Some abilities won't roll to hit.
  // TODO: Handle different template type: attack, hold, coup-de-grace.
  doMonsterAbility(monster, ability) {
    monster.useAbility(ability.code);

    let template = AbilityDictionary.lookup(ability.code);
    let target = CharacterLibrary.getCachedCharacter(monster.getTarget());
    let result = this.#getAttackResult(monster, target, template.targetSlot, ability.hit);

    result.ability = ability.code;

    if (result.is == 'hit') {
      result.damage = this.rollDamage(ability.damage);
    }
    if (result.is == 'critical-hit') {
      result.damage = this.rollDamage(ability.damage,2);
    }
    if (result.is == 'critical-miss') {
      // TODO: Determine critical failure result for monster. We could do a few
      //       interesting things here. Add a prone condition, have them hit an
      //       ally instead.
    }

    if (result.damage) {
      target.getCondition().adjustCurrentHitPoints(-result.damage);
    }

    // Set condition of monster or target.
    if (template.setCondition && this.#isValidWhen(result, template.setCondition.when)) {
      result.setConditionOn = template.setCondition.on;
      result.setConditionCode = template.setCondition.condition;

      if (template.setCondition.on == 'self') {
        monster.getCondition().setCondition(template.setCondition.condition);
      }
      if (template.setCondition.on == 'target') {
        target.getCondition().setCondition(template.setCondition.condition);
      }
    }

    // Add status to monster or target.
    if (template.addStatus && this.#isValidWhen(result, template.addStatus.when)) {
      result.addStatusOn = template.addStatus.on;
      result.addStatusCode = template.addStatus.status;

      if (template.addStatus.on == 'self') {
        monster.getCondition().setStatus(template.addStatus.status, template.addStatus.duration);
      }
      if (template.addStatus.on == 'target') {
        target.getCondition().setStatus(template.addStatus.status, template.addStatus.duration);
      }
      if (template.addStatus.on == 'all-ally') { throw `TODO: Implement all-ally target for status effects.`}
      if (template.addStatus.on == 'all-enemy') { throw `TODO: Implement all-enemy target for status effects.` }
      if (template.addStatus.on == 'ally') { throw `TODO: Implement random ally target for status effects.` }
      if (template.addStatus.on == 'rank') { throw `TODO: Implement rank target for status effects.` }
    }

    console.log("Result:",result);

    // TODO: We then need to pick a story, weave the story text. Possibly add
    //       bonus damage.

  }

  #isValidWhen(result, when) {
    if (when == 'always')  { return true; }
    if (when == 'success') { return ['hit','critical-hit'].indexOf(result.is) >= 0; }
    if (then == 'failure') { return ['miss','critical-miss'].indexOf(result.is) >= 0; }
  }

  // Roll to get the attack result. If targetSlot is null a random slot will be
  // picked. Hit bonus is 0 by default and only applies to some abilities.
  #getAttackResult(monster, target, targetSlot, hitBonus=0) {
    let roll = Random.rollDice({ d:20 })
    if (roll == 1)  { return { roll:1,  is:'critical-miss' }; }
    if (roll == 20) { return { roll:20, is:'critical-hit' };  }

    let targetArmorClass = target.getArmorClass(targetSlot || BattleEngine.randomSlot());
    let adjustedHit = roll + monster.getBaseHit() + hitBonus;

    return {
      roll: roll,
      is: (adjustedHit >= targetArmorClass) ? 'hit' : 'miss'
    };
  }

  rollDamage(damage, multiplier=1) {
    return (damage == null) ? 0 : Math.floor(Random.rollDice(damage) * multiplier);
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