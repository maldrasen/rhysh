EventDictionary.register('game.start',{

  stages:[{
    background:'ship-1',
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
              wizards.`, background:'vault-1' },
      { text:`Wars have been fought over a single Rhyshian artifact, so it's no doubt that an island presumably full of
              them would cause no end of trouble for the world, and to complicate matters even further a untamed
              dungeon had been found on the island.` },
      { text:`It's the responsibility of the guild to manage the dungeons, control their growth and to keep the
              monsters in check, and this dungeon has not only grown wild for centuries, but was formed on the seat of
              power of a lost of empire known for their unsavory practices and barely understood magic.` },

      { text:`Although that is of course what has brought {{P::firstName}} here.` },
      { text:`That and the dreams.`, background:'event-orgy-1' },

      { text:`The dreams have haunted {{P::him}} for months now, and while {{P::he}} can't remember any details, they
              leave a strong impression of lurid sensuality that has {{P::him}} hard and throbbing every morning when
              {{P::he}} wakes.`, requires:`player.not-female` },
      { text:`The dreams have haunted her for months now, and while she can't remember any details, they leave a strong
              impression of lurid sensuality that has her flushed and dripping every morning when she wakes.`,
              requires:`player.female` },

      { text:`Though the guild may have tried to keep the island a secret, adventurers are a talkative lot. When word
              of the discovery reached {{P::firstName}} it struck a chord within {{P::him}}. Somehow {{P::he}} knew the
              island had been calling to {{P::him}}.`, background:'ship-2' },
      { text:`Perhaps it was destiny or perhaps it was just delusion. Either way {{P::he}} knew he had to make the
              journey here, to seek {{P::his}} fortune among the bones of the old Rhysh empire.` },
    ]
  },{
    requires:'player.archetype=chosen',
    background:'ship-2',
    pages: [
      { text:`Start as Chosen` },
    ]
  },{
    requires:'player.archetype=cultist',
    background:'ship-2',
    pages: [
      { text:`Start as Cultist` },
    ]
  },{
    requires:'player.archetype=dominatrix',
    background:'ship-2',
    pages: [
      { text:`Start as Dominatrix` },
    ]
  },{
    requires:'player.archetype=knight',
    pages: [
      { text:`As a knight of the Order of the Umbral Bastion it wasn't difficult for him to force his way abord the
              guild ship. The Black Knights are purportedly an order of demon hunters, and thus can make certain
              demands.` },
      { text:`To bar him passage would only make the guild look like it had something to hide, though he was certain
              his reception will be less than welcoming when he finally did arrive.` },
    ]
  },{
    requires:'player.archetype=mindbender',
    background:'ship-2',
    pages: [
      { text:`Start as Mindbender` },
    ]
  },{
    requires:'player.archetype=slaver',
    background:'ship-2',
    pages: [
      { text:`Though the Adventurer's Guild was still limiting access to the island to only their most seasoned and
              trusted members, {{P::anElf}} of {{P::firstName's}} talents had little trouble finding someone "willing"
              to part with the necessary documents to secure {{P::his}} passage.` },
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
