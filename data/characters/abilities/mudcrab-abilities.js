
// Clearly we're going to need a more in depth system to determine when character's various body parts are exposed and
// open to attack... This will probable tie into the equipment system, and will serve to make some mechanics more
// important, like the nymphs's inability to wear clothing, or the dominitrix's impractical armor requirement. Classes
// like the black knight could even have invulnurable armor that can't be exposed by normal means.

AbilityDictionary.register('crab-claw', {
  type: 'attack',
  stories: [
    { attempt: `The Mudcrab attacks {{T::name}} with its claws.`,
      hit: `It pinches {{T::his}} {{battle|target-slot-word}} painfully.` },

    { attempt: `The Mudcrab attacks {{T::name}} with its claws.`,
      hit: `Its sharp claw draws a deep scratch across {{T::his}} {{battle|target-slot-word}}.` },

    { when: ['attack.hits-head'],
      bonusDamage: 2,
      attempt: `The Mudcrab slashes at {{T::name}} with its claws.`,
      hit: `Its sharp claw cuts a deep wound across {{T::his}} face.` },

    { when: ['attack.hits-chest','target.has-tits'],
      chance: 10,
      bonusDamage: 2,
      attempt: `The Mudcrab slashes at {{T::name's}} breasts with its claws.`,
      hit: `The Mudcrab grabs onto both of {{T::his}} breasts and pinches down hard, leaving dark bruises on {{T::his}}
            tits.` },

    { when: ['attack.hits-legs','target.not-male'],
      chance: 50,
      attempt: `The Mudcrab slashes at {{T::name's}} legs with its claws.`,
      hit:`The Mudcrab pinches {{T::his}} rounded ass painfully hard.` },

    { when: ['attack.hits-legs','target.cock-exposed'],
      chance: 10,
      bonusDamage: 4,
      attempt: `The Mudcrab slashes at {{T::name's}} legs with its claws.`,
      hit:`The Mudcrab somehow manages to grab onto {{T::name's}} dangling ballsack and pinches down hard, almost
            crushing one of {{T::his}} balls.` },
  ],
});

AbilityDictionary.register('crab-grab-legs', {
  type: 'attack',
  cooldown: 5,
  targetSlot: 'legs',

  setCondition: { on:'self', condition:'holding-legs', when:'success' },
  addStatus: { on:'target', status:'bound-legs', when:'success' },
  story: {
    attempt:`The Mudcrab lunges for {{T::name's}} legs.`,
    hit:`It grabs on to both of {{T::his}} legs holding them tightly in its claws.`
  },
});

AbilityDictionary.register('crab-grab-arms', {
  type: 'attack',
  cooldown: 5,
  targetSlot: 'hands',

  setCondition: { on:'self', condition:'holding-arms', when:'success' },
  addStatus: { on:'target', status:'bound-arms', when:'success' },
  story: {
    attempt:`The Mudcrab lunges for {{T::name's}} arms.`,
    hit:`It grabs on to both of {{T::his}} wrists holding them tightly in its claws.`
  },
});

AbilityDictionary.register('crab-leg-crush', {
  type: 'hold',
  requires: ['monster.condition=holding-legs'],
  story: { text:`The Mudcrab squeezes {{T::name's}} ankles, crushing them painfully in its sharp claws.` }
});

AbilityDictionary.register('crab-arm-crush', {
  type: 'hold',
  requires: ['monster.condition=holding-arms'],
  story: { text:`The Mudcrab squeezes {{T::name's}} wrists, crushing them painfully in its sharp claws.` }
});

AbilityDictionary.register('crab-brutalize', {
  type: 'coup-de-grace',
  requires: ['target.status=bound-arms','target.status=bound-legs'],
  storyTeller: 'MudcrabBrutalizer',
});

// TODO: Actually... this is one ability is complicated enough to need a separate story teller class, it has complex
//       branching logic that depends on what the person is wearing, it changes the state of their equipment, and all
//       kinds of shit. For now, we can just add a todo story and do damage.
//
// TODO: This could get rather complicated as we need to describe the character's crotch getting exposed, but that
//       could be different for each piece of equipment. I think we need to require each armor type to include a
//       description of it getting destroyed that attacks like this can tap into. Something like:
//
//           '{{T::name's}} panties have been shredded, leaving {{T::him}} completely exposed!'
//           'A wide hole has been torn through {{T::name's}} leather pants, letting his cock dangling in front of him!'
//
//       This also tests if the character is wearing cloth or leather, not allowing metal to be torn through.

  // attackStoryPrefix: `With {{T::name's}} arms and legs being held by other crabs, {{T::he}}'s unable to defend
  //   {{T::him}}self as the Mudcrab `,
  // attackStories: [
  //   { when:['target-is-legs','target-covered-by-cloth'], effect:'expose-crotch',
  //     text:`claws and rips at the cloth between {{T::hisLegs}}. {{T::equipment.CharactersPantsHaveBeenDestroyed!}} ` },
  //   { when:['target-is-legs','target-covered-by-leather'], effect:'expose-crotch',
  //     text:`claws and rips at the leather between {{T::hisLegs}}. {{T::equipment.CharactersPantsHaveBeenDestroyed!}} ` },
  //   { when:['target-is-legs','target-not-exposed','target-not-covered-by-cloth-or-leather'],
  //     text:`brutally pinches at the gaps in {{T::his}} leg armor. It tries to rip {{T::name's}} armor off but
  //           isn't able to claw through the metal.` },

  //   { when:['target-is-legs','target-exposed'],
  //     text:`brutalizes {{T::his}} ass, beating and pinching at {{T::his}} firm ass cheaks with its sharp claws.` },
  //   { when:['target-is-legs','target-exposed','target-has-cock'], chance:25, bonusDamage:4,
  //     text:`brutalizes {{T::his}} cock, grabbing and pulling at the {{P::cock.sixInch}} long shaft in an attempt to rip
  //           {{T::his}} dick off with one of its claw while the other attempts to completely crush his balls. ` },
  //   { when:['target-is-legs','target-exposed','target-has-pussy'], chance:25, bonusDamage:4,
  //     text:`brutally attacks {{T::his}} pussy, pinching and pulling {{T::his}} pussy lips.` },
