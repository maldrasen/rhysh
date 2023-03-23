global.RollSavingThrow = (function() {

  let $roller
  let $save

  // Rolling a saving throw first needs to gather up all the bonus and
  // penalities that could be applied. I can already see that there are going
  // to be a lot of these so this will be ever evolving.
  //
  // Like an attack roll a saving throw should return the roll and its
  // modifiers as well as the save type, target DC, and pass or fail.
  function roll(roller, save) {
    $roller = roller;
    $save = save;
    $category = SavingThrows[save.category];

    if ($save.dc == null) { throw `A save DC is required.` }
    if ($category == null) { throw `A save category is required.` }

    const result = {
      label: $category.label,
      attribute: $category.attribute,
      roll: Random.rollDice({ d:20 }),
    }

    result.bonus = ($roller.classname == _characterActor) ?
      calculateChatacterBonus():
      calculateMonsterBonus();

    result.result = (result.roll + result.bonus >= save.dc) ? _savePassed : _saveFailed;

    return result;
  }

  // TODO: It's safe to leave this unimplemented for now. At the very least
  //       I'm going to need to look at the main character, see if they have an
  //       aura with a passive effect, see if that effect applies to this save,
  //       and return it. However there are potentially a lot of passive saving
  //       throw effects.
  //
  //       Some of these passive effects effect all monsters or all characters.
  //       Something like a blessing or a curse spell would adjust the bonus in
  //       either direction.
  //
  //       Becides the main character do other characters have aura like
  //       passive effects?
  //
  //       In addition to these global effects there are individual effects.
  //       Some characters have a non-aura based resistance. Equipment can
  //       grant resistance. On going spell effects can

  function calculateChatacterBonus() {
    return 0;
  }

  function calculateMonsterBonus() {
    return 0;
  }

  return { roll };

})()