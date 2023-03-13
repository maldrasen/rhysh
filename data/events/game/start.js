EventDictionary.register('game.start',{

  attributeChecks:{
    lookSexy:{ attribute:'cha', target:14 },
  },

  speakers:{
    woman:{ portrait:'characters/character-khatria' },
    Khatria:{ portrait:'characters/character-khatria', label:'Khatria' },
  },

  stages:[{
    background:'prison-1',
    filter:{ effect:'wakeUp' },
    pages:[
      { text:`You slowly wake to the sound of dripping water and a splitting headache.` },
      { text:`With a groan you carefully push yourself up and take a look around at the small prison cell you've found
              yourself in.` },

      { requires:'player.species.isNot(nymph,satyr)',
        text:`The ground is uncomfortably wet with half an inch of filthy water pooling underneath you. To make matters
              worse it seems you've been stripped naked as well.` },

      { requires:'player.species=nymph',
        text:`The ground is uncomfortably wet with half an inch of filthy water pooling underneath you. As a water
              spirit a little wetness isn't enough to bother you, but you do wish it was at least a little cleaner.` },

      { requires:'player.species=satyr',
        text:`The ground is uncomfortably wet with half an inch of filthy water pooling underneath you. It seems you've
              been stripped naked as well. Not that you wear much anyway though you wish you at least had something to
              shield you from the cold clammy air.` },

      { background:'ship-1',
        text:`You try to remember how you got here. The last thing you remember was standing at the prow of the guild
              ship, watching the horizon as the large island in the distance grew closer.` },
      { text:`The ship was an Adventurer's Guild supply ship, supporting the guild's secret expedition to the Island of
              Rhysh. Knowing the ship was bound for the lost island you procured what forged documents you needed to be
              allowed on board.` },
      { text:`Perhaps your deception was found out.` },

      { background:'prison-1',
        text:`That would explain your current situation.` },

      { text:`You wait for what feels like hours, properly languishing in your dank cell. Eventually your jailer
              decides to show himself, a large and well armored orc. You can tell from his expression that he'd love
              any excuse to knock you completely unconscious once again, so you wisely remain silent as he starts
              unchaining you from the wall.` },

      { background:'prison-2',
        text:`Wearing nothing but a pair of manacles you're led into the next room which seems to be an interrogation
              room of some sort. You're pushed down into a chair and left to wait.` },

      { text:`A few minutes later a well dressed and severe looking elf walks into the room, baring a stack of familiar
              looking documents which she casually drops on the table before sitting opposite you.` },

      { speaker:'woman',
        text:`"I'm a busy woman. I'll give you five minutes to explain what you're doing here and why I shouldn't just
              toss you back into the ocean."` },

      { text:`You had been expecting something like this. Perhaps, not quite so soon, but while your forgeries were
              enough to get you aboard the ship you knew they wouldn't pass muster once they were presented to the
              guild.` },
      { text:`You can't tell her the real reason of course, that the dreams led you here.` },
    ]
  },{
    selectionStage: true,
    selectionHeader: `Instead you offer a plausible explanation`,
    selectionKey: 'explanation',
    selections:[
      { text:`I'm a knight of the Order of the Umbral Bastian`, value:'knight',   requires:'player.archetype=knight' },
      { text:`I'm a scholar from the Artificum of Xanth.`,      value:'scholar',  requires:'player.int>=10' },
      { text:`I'm a traveling bard.`,                           value:'bard',     requires:'player.cha>=10' },
      { text:`I'm an explorer and treasure hunter.`,            value:'explorer', requires:'player.str>=10' },
    ]
  },{
    when: { explanation:'knight' },
    pages:[
      { speaker:'player',
        text:`"I'll have you know I am a knight of the Order of the Umbral Bastian. Certain rumors have come to the
              attention of my order that I've been sent here to investigate. The Island of Rhysh, home to the last and
              greatest human empire, after all these centuries its location has finally been uncovered."` },
      { speaker:'player',
        text:`"While I understand your guild's need for secrecy concerning the island, my order is charged with
              defending against possible Incursions. No one knows what happened to Rhysh, the possibility of demonic
              involvement cannot be overlooked."` },
      { speaker:'player',
        text:`"I understand that my documentation may not be in order. There simply wasn't the time to go through the
              proper channels, not when a situation of this severity has arisen."` },
      { speaker:'woman',
        text:`The woman sighs and shakes her head, no doubt frustrated that this situation has become political now.
              "Knights... just what I fucking need. Fine. I won't have you thrown off the island, but whatever rumors
              you've heard clearly haven't covered the entirety of our situation here."` },
    ],
  },{
    when: { explanation:'scholar' },
    pages:[
      { speaker:'player',
        text:`"I apologize for any confusion or trouble I may have caused. I am a scholar from the Artificum of Xanth.
              There are certain rumors that have recently surfaced that I've been sent here to investigate. The Island
              of Rhysh, home to the last and greatest human empire, after all these centuries its location has finally
              been uncovered."` },
      { speaker:'player',
        text:`"While I understand your guild's need for secrecy concerning the island, given the likelihood that there
              are extremely dangerous artifacts to be found here. Which is of course why the Artificum felt the need to
              pursue their own investigation."` },
      { speaker:'player',
        text:`"I understand that my documentation may not be in order, but I assure you that my intentions are purely
              academic and I have no interest in causing any harm or trouble for the guild or its members."` },
      { speaker:'woman',
        text:`The woman sighs and shakes her head, no doubt frustrated that this situation has become political now.
              "The Artificum... just what I fucking need. Fine. I won't have you thrown off the island, but whatever
              rumors you've heard clearly haven't covered the entirety of our situation here."` },
    ],
  },{
    when: { explanation:'bard' },
    pages:[
      { speaker:'player',
        text:`You put on your most convincing smile, trying to look harmless for the severe looking elf, "I apologize
              for any confusion or trouble I may have caused. I promise I'm not anyone dangerous, just a traveling
              bard, out to see the world and collect its stories."` },
      { speaker:'player',
        text:`"You see, I've heard some interesting rumors recently. The Island of Rhysh, home to the last and greatest
              human empire, after all these centuries its location has finally been uncovered. And there's a secret
              expedition to explore the ancient ruins. Knowing all this staying away simply wasn't possible for a
              {{P::man}} like me."` },
      { speaker:'player',
        text:`"I understand the severity of my actions and I'm willing to accept any punishment you see fit. But I
              promise you that I'm not here to cause trouble or disrupt your mission in any way. If you'll allow me to
              join your expedition and contribute my knowledge and skills, I'll do everything in my power to make it
              worth your while."` },
      { speaker:'woman',
        text:`The woman sighs and shakes her head, "A bard... just what I fucking need. Fine. I won't have you thrown
              off the island, but whatever rumors you've heard clearly haven't covered the entirety of our situation
              here."` },
    ],
  },{
    when: { explanation:'explorer' },
    pages:[
      { speaker:'player',
        text:`"I apologize for any trouble I may have caused. I'm an explorer... well a bit of a treasure hunter
              really, and I've heard some interesting rumors recently. The Island of Rhysh, home to the last and
              greatest human empire, after all these centuries its location has finally been uncovered."` },
      { speaker:'player',
        text:`"It's understandable, keeping this discovery to yourself. Wars have been fought over a single Rhyshian
              artifact after all. However, this is also the single greatest discovery in centuries. Once I knew what
              had been found here, staying away simply wasn't possible for a {{P::man}} like me."` },
      { speaker:'player',
        text:`"I understand the severity of my actions and I'm willing to accept any punishment you see fit. But I
              promise you that I'm not here to cause trouble or disrupt your mission in any way. If you'll allow me to
              join your expedition and contribute my knowledge and skills, I'll do everything in my power to make it
              worth your while."` },
      { speaker:'woman',
        text:`The woman sighs and shakes her head, "A fucking treasure hunter... just what I fucking need. Fine. I
              won't have you thrown off the island, but whatever rumors you've heard clearly haven't covered the
              entirety of our situation here."` },
    ],
  },{
    pages:[
      { speaker:'woman',
        text:`"Rhysh isn't just ruins, it's a dungeon, and it covers the entire island. It's been growing here,
              uncontrolled for centuries, perhaps even longer. And because it's a dungeon that puts the Adventurer's
              Guild in charge here understand?"` },

      { text:`That would explain a few things. The Adventurer's Guild is charged with controlling and maintaining the
              dungeons, making sure they don't grow out of control and start threatening the surrounding areas.` },
      { text:`Wild dungeons like this are rare, but when they are found they're maybe only a few decades old at most
              and generally much smaller. Even so, it sometimes takes years for the guild to fully bring the dungeon
              to heel. A dungeon that covers the entire island? They might never get it under control.` },

      { speaker:'player',
        text:`"I see, so your real purpose here is"` },

      { speaker:'woman',
        text:`"To keep idiots like you from wandering in and triggering whatever stupid dark magic killed all the
              humans off to begin with," she interrupts. "But then yes, find the dungeon core, take control, stop its
              growth."` },

      { speaker:'woman', attributeCheck:{'lookSexy':true},
        text:`She frowns as she looks you over, though you do notice a slight flush in her cheeks as her eyes roam over
              your naked body, "As you can imagine we're... understaffed. I'll allow you to stay, but under the
              condition that you'll officially join the guild and agree to follow orders."` },

      { speaker:'woman', attributeCheck:{'lookSexy':false},
        text:`She frowns as she looks you over, "As you can imagine we're... understaffed. I'll allow you to stay, but
              under the condition that you'll officially join the guild and agree to follow orders."` },

      { speaker:'player',
        text:`You nod, knowing it's the best offer you're likely to get, "Very well."` },

      { speaker:'Khatria',
        text:`She stands up, reaches over the table and starts to unlock the shackles still tightly locked around your
              wrists. "Guildmistress Khatria Bremen. Welcome to the guild, try not to die. Your shit's in the trunk
              over by the wall. Once you're dressed go talk to Serthia in front."` },

      { speaker:'player', requires:'player.species=nymph',
        text:`Once your wrists are finally freed from the shackles you give her a wink, "But I'm already dressed." She
              sighs and shakes her head, saying something under her breath before leaving you alone in the dark once
              again.` },

      { requires:'player.species!=nymph',
        text:`With that she turns and exits the room, leaving you alone in the dark once again.` },
    ],
  }],

  onFinish: function(choices) {
    console.log("Event Complete, set flag from ",choices);
  },

});
