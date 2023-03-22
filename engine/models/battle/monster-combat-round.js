global.MonsterCombatRound = class MonsterCombatRound {

  // TODO: Some abilities won't have a target.
  // TODO: Some abilities won't roll to hit.
  // TODO: Handle different ability types: attack, hold, coup-de-grace.
  // doAbility() {
  //   let result = new CombatResult(this);
  //   let ability = this.getAbility();
  //   let monster = this.getActor();
  //   let hit = (ability.hitBonus || 0) + monster.getBaseHit();

  //   monster.useAbility(ability.code);

  //   result.chooseTargetSlot(ability.targetSlot);
  //   result.rollAttack(hit);
  //   result.rollDamage(ability.damage);
  //   result.updateCondition();
  //   result.updateStatus();
  //   result.selectStory();
  //   result.commitDamage();

  //   this.#combatResults.push(result);
  //   this.checkCondition();
  // }

}
