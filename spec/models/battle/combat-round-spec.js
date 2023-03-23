describe('CombatRound', function() {

  const knightAttackSetup = function() {
    GameState.setCurrentBattle(new BattleState());
    SpecHelper.randomMainCharacter({ archetype:'knight' });

    let combatAction = new CombatAction({
      actorClassname: _characterActor,
      actorItentifier: 'Main',
      action: _attack,
      targetType: _rank,
      targetRank: _rank_1,
      mainMode: _slash,
      offMode: _block,
    });

    return combatAction;
  }

  const knightAbilitySetup = function() {
    GameState.setCurrentBattle(new BattleState());
    SpecHelper.randomMainCharacter({ archetype:'knight' });

    let combatAction = new CombatAction({
      actorClassname: _characterActor,
      actorItentifier: 'Main',
      action: _ability,
      ability: 'terrify',
    });

    return combatAction;
  }

  const gobboAttackSetup = function() {
    GameState.setCurrentBattle(new BattleState({ monster:'goblin' }));
    SpecHelper.randomMainCharacter();

    let combatAction = new CombatAction({
      actorClassname: _monsterActor,
      actorItentifier: 'M1',
      action: _attack,
      targetType: _single,
      targetIdentifier: 'Main',
      targetClassname: _characterActor,
    });

    return combatAction;
  }

  const gobboAbilitySetup = function() {
    GameState.setCurrentBattle(new BattleState({ monster:'goblin' }));
    SpecHelper.randomMainCharacter();

    let combatAction = new CombatAction({
      actorClassname: _monsterActor,
      actorItentifier: 'M1',
      action: _ability,
      ability: 'bad-idea',
      targetIdentifier: 'Main',
      targetClassname: _characterActor,
    });

    return combatAction;
  }


  const crabboSetup = function() {
    GameState.setCurrentBattle(new BattleState({ monster:'mudcrab' }));
    SpecHelper.randomMainCharacter();

    let combatAction = new CombatAction({
      actorClassname: _monsterActor,
      actorItentifier: 'M1',
      action: _ability,
      ability: 'crab-grab-legs',
      targetIdentifier: 'Main',
      targetClassname: _characterActor,
    });

    return combatAction;
  }

  it('builds and executes a character attack combat round', function() {
    let action = knightAttackSetup();
    let round = new CombatRound(CharacterLibrary.getMainCharacter(), action);
        round.execute();

    let rendered = CombatRoundRenderer.render(round);
    let event = rendered.attackEvents[0];

    // console.log("=== Rendered ===")
    // console.log(JSON.stringify(rendered));

    expect(event.actionStory).to.match(/longsword/)
    if (event.attackResult == _hit) { expect(event.attackDamage).to.be.greaterThan(0); }
  });

  // it('builds and executes a character ability combat round', function() {
  //   let action = knightAbilitySetup();
  //   let round = new CombatRound(CharacterLibrary.getMainCharacter(), action);
  //       round.execute();

  //   let rendered = CombatRoundRenderer.render(round);

  //   console.log("=== Rendered ===")
    // console.log(JSON.stringify(rendered));
  // });

  it('builds and executes a monster attack combat round', function() {
    let action = gobboAttackSetup();
    let gobbo = GameState.getCurrentBattle().getMonster('M1');

    let round = new CombatRound(gobbo, action);
        round.execute();

    let rendered = CombatRoundRenderer.render(round);

    // console.log("=== Rendered ===")
    // console.log(JSON.stringify(rendered));
  });

  it('builds and executes a monster ability combat round (with damage)', function() {
    let action = gobboAbilitySetup();
    let gobbo = GameState.getCurrentBattle().getMonster('M1');

    let round = new CombatRound(gobbo, action);
        round.execute();

    let rendered = CombatRoundRenderer.render(round);

    // console.log("=== Rendered ===")
    // console.log(JSON.stringify(rendered));
  });

  it('builds and executes a monster ability combat round (with status effect)', function() {
    let action = crabboSetup();
    let crabbo = GameState.getCurrentBattle().getMonster('M1');

    let round = new CombatRound(crabbo, action);
        round.execute();

    let rendered = CombatRoundRenderer.render(round);

    // console.log("=== Rendered ===")
    // console.log(JSON.stringify(rendered));
  });

});
