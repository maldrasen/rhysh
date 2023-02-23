EventDictionary.register('game.start',{

  stages:[{
    requires:'player.archetype=chosen',
    background:'new-game-2',
    pages: [
      { text:`Start as Chosen` },
    ]
  },{
    requires:'player.archetype=cultist',
    background:'new-game-2',
    pages: [
      { text:`Start as Cultist` },
    ]
  },{
    requires:'player.archetype=dominatrix',
    background:'new-game-2',
    pages: [
      { text:`Start as Dominatrix` },
    ]
  },{
    requires:'player.archetype=knight',
    background:'new-game-2',
    pages: [
      { text:`Start as Black Knight` },
    ]
  },{
    requires:'player.archetype=mindbender',
    background:'new-game-2',
    pages: [
      { text:`Start as Mindbender` },
    ]
  },{
    requires:'player.archetype=slaver',
    background:'new-game-2',
    pages: [
      { text:`Start as Slaver` },
    ]
  },{
    background:'town',
    pages: [
      { text:`Walk about town` }
    ]
  },{
    background:'guild',
    pages: [
      { text:`Talk to the guildmistress` }
    ]
  }],

});
