global.CharacterCombatRound = class CharacterCombatRound {

  #character;
  #action;
  #ability;
  #abilityTemplate;

  #combatResults;
  #triggers;

  constructor(character, action) {
    this.#character = character;
    this.#action = action;
    this.#combatResults = [];
    this.#triggers = [];
  }

  execute() {
    if (this.#action.isAttack()) { this.doAttack(); }
    if (this.#action.isAbility()) { this.doAbility(); }
  }

  getClassName() { return "CharacterCombatRound"; }
  // getCombatResults() { return this.#combatResults; }
  // getTriggers() { return this.#triggers; }
  // clearTriggers() { this.#triggers = []; }

  getActor() { return this.#character; }
  getActorType() { return 'Character'; }

  getCombatAction() { return this.#action; }
  // getTarget() { return this.#target; }

  // getAbilityCode() { return this.#ability ? this.#ability.code : null; }
  // getAbilityTemplate() { return this.#abilityTemplate; }

  // addTrigger(trigger) {
  //   if (this.#triggers.indexOf(trigger) < 0) { this.#triggers.push(trigger); }
  // }

  doAttack() {
    // this.determineTarget();

    // console.log("=== Doing attack ===")
    // console.log("Target is:",this.#target.getActor().getID());

    // let result = new CombatResult(this);
    // let hit = this.#character.getBaseHit();

    // console.log("Hit:",hit);

    // while(hit > 0) {
      // if (mainMode) {
      //   result = this.doSingleAttack(hit, weapons.main, mainMode);
      // }
      // if (offMode && hit-2 >= 0) {
      //   result = this.doSingleAttack(hit-2, weapons.off, offMode);
      // }

      // hit = (result.isCriticalMiss()) ? -1 : hit - 5;
      // this.#combatResults.push(result);
    // }
  }

  // doSingleAttack(hitBonus, weapon, mode) {
  //   let result = new CombatResult(this);

  //   result.setWeaponBase(weapon);
  //   result.setWeaponMode(mode);
  //   result.chooseTargetSlot();

  //   if (result.isWeaponAttackMode()) {
  //     result.rollAttack(hitBonus);
  //     result.rollDamage(weapon.damage, this.getMonster().getAttributes().strModifier());
  //     result.setStory(new WeaponAttackStoryTeller(result).tellStory());
  //   } else {
  //     result.useWeapon();
  //   }

  //   result.commitDamage();
  //   this.checkCondition();
  //   return result;
  // }

  // If the off hand weapon is null, it's probably a shield or something that
  // we don't need to worry about.
  // lookupWeapons() {
  //   let main;
  //   let off;

  //   if (this.getMonster().getMainHand()) {
  //     main = WeaponDictionary.lookup(this.getMonster().getMainHand());
  //   }
  //   if (this.getMonster().getOffHand()) {
  //     try {
  //       off = WeaponDictionary.lookup(this.getMonster().getOffHand());
  //     } catch(error) {
  //       off = null;
  //     }
  //   }

  //   return { main:main, off:off };
  // }

  // TODO: Some abilities won't have a target.
  // TODO: Some abilities won't roll to hit.
  // TODO: Handle different template type: attack, hold, coup-de-grace.
  // doAbility(ability) {
  //   this.#ability = ability;
  //   this.#abilityTemplate = AbilityDictionary.lookup(ability.code);

  //   this.#monster.useAbility(ability.code);

  //   let result = new CombatResult(this);
  //   result.chooseTargetSlot(this.#abilityTemplate.targetSlot);
  //   result.rollAttack(this.#ability.hit);
  //   result.rollDamage(this.#ability.damage);
  //   result.updateCondition();
  //   result.updateStatus();
  //   result.selectStory();
  //   result.commitDamage();

  //   this.#combatResults.push(result);
  //   this.checkCondition();
  // }

  // checkCondition() {
  //   let condition = this.#target.getCondition();
  //   if (this.getTargetCode() == 'Main') {
  //     if (condition.hasCondition('fainted')) { this.addTrigger('main-character-fainted'); }
  //     if (condition.hasCondition('dead')) { this.addTrigger('main-character-killed'); }
  //   }
  // }

  // The first thing we need to do when executing most abilities is determine
  // the target of the action.
  //
  // If we're targeting a rank of monsters we check to see if the monster we
  // targeted last round is in that rank. If so we attack the same monster.
  // If we don't have a previous monster or that monster is dead we choose one
  // at random. (for now)
  //
  // Using an area of effect ability, or an ability that doesn't target a
  // monster should clear the previous target.
  //
  // TODO: We should make this smarter by having the character target weakened
  //       monsters. If a monster is stunned they should switch to attacking
  //       that target instead.
  //
  determineTarget() {
    // let battleState = GameState.getCurrentBattle()
    // let previousTarget = battleState.getCharacterTarget(this.#character.getCode());

    // this.#target = new Target(this.#action.getTargetType());

    // // We know we're targeting a single monster.
    // if (this.#target.getType() == _monster) {
    //   if (previousTarget && this.previousTargetValid(previousTarget.getActor())) { return previousTarget; }


    //   let monster = Random.from(battleState.getRank(this.#action.getTargetRank()).monsters)

    //   console.log("MONSTER:",monster.getID())

    //   // this.#target.setActor();
    //   return;
    // }

    // throw `TODO: Build a target object for this type.`
  }

  // Target is no longer valid if dead or fainted, out of range, or if their
  // squad has moved.
  previousTargetValid(monster) {
    // if (monster == null) { return false; }
    // if (monster.getCondition().hasCondition(_dead)) { return false; }
    // if (monster.getCondition().hasCondition(_fainted)) { return false; }

    // TODO: Check monster range.

    // let rank = this.#action.getTargetRank(); Is monster in rank???
    // TODO: Check monster is in rank targeted by action, lets have a previous
    //       target before we do this though...

    return true;
  }

  // pack() {
  //   let packed = {
  //     monsterID: this.#monster.getID(),
  //     results: this.#combatResults.map(combatResult => { return combatResult.pack(); }),
  //   };

  //   if (this.#ability) { packed.ability = this.#ability.code; }
  //   if (this.#target) { packed.target = this.#target.getCode(); }
  //   if (this.#triggers) { packed.triggers = this.#triggers; }

  //   return packed;
  // }
}
