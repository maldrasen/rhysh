global.ConditionDictionary = (function() {

  const conditions = {
    normal:  {},
    fainted: {},
    dead:    {},

    // Prone and stunned are functionally the same, the monster cannot take
    // action this round though the state is cleared afterwards.
    prone:   { effect:'stun' },
    stunned: { effect:'stun' },

    // Holding is a grappling state indicating that the monster is holding onto
    // a character's body or body part and con only take further holding 'actions'
    holdingArms: { effect:'hold' },
    holdingBody: { effect:'hold' },
    holdingLegs: { effect:'hold' },
  }

  function lookup(code) {
    if (conditions[code] == null) { throw `Unknown Condition: ${code}` }
    return conditions[code];
  }

  return { lookup };

})();
