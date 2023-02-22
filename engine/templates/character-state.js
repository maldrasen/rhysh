global.CharacterState = (function() {

  const StateDictionary = {
    'normal': { effect:'none' },

    // Prone and stunned are functionally the same, the monster cannot take
    // action this round though the state is cleared afterwards.
    'prone':   { effect:'stun' },
    'stunned': { effect:'stun' },

    // Holding is a grappling state indicating that the monster is holding onto
    // a character's body or body part and con only take further holding 'actions'
    'holding-arms': { effect:'hold' },
    'holding-body': { effect:'hold' },
    'holding-legs': { effect:'hold' },
  }

  function lookup(state) {
    if (StateDictionary[state] == null) { throw `Unknown State: ${state}` }
    return StateDictionary[state];
  }

  return { lookup };

})();
