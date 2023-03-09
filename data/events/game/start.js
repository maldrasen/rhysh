EventDictionary.register('game.start',{

  stages:[{
    background:'new-game-2',
    pages:[
      { text:`{{P::firstName}} stood at the prow of the guild ship, watching the horizon as the large island in the
              distance grew closer.` },
      { text:`The seas this far north were treacherous in the best of conditions and the storm that had been following
              them threatened to overtake them if they didn't make landfall soon.` },
      { text:`There were more than ten thousand islands in the Great Northern Archipelago, and because of the way the
              archipelago sat between the two northern oceans the currents that swept past the islands were both
              fierce and unpredictable.` },
      { text:`While the journey though the archipelago would cut the travel time from Caldwyn to Ithadross by a few
              days, only the truly desperate or foolhardy would risk it. It's hardly surprising then that it took so
              long for the legendary island of Rhysh to be rediscovered.` },
      { text:`The Adenturer's Guild is of course doing all they can to keep that discovery a secret.` },
      { text:`It's understandable really. The ancient human empire had magics that are still beyond today's greatest
              wizards.` },
      { text:`Wars have been fought over a single Rhyshian artifact, so it's no doubt that an island presumably full of
              them would cause no end of trouble for the world, and to complicate matters even further a untamed
              dungeon had been found on the island.` },
      { text:`It's the responsibility of the guild to manage the dungeons, control their growth and to keep the
              monsters in check, and this dungeon has not only grown wild for centuries, but was formed on the seat of
              power of a lost of empire known for their unsavory practices and barely understood magic.` },
      { text:`Although that is of course what has brought {{P::firstName}} here.` },
      { text:`That and the dreams.` },
    ]
  },{
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
    background:'battle-town-1',
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
