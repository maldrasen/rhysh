
// Clearly we're going to need a more in depth system to determine when character's various body parts are exposed and
// open to attack... This will probable tie into the equipment system, and will serve to make some mechanics more
// important, like the nymphs's inability to wear clothing, or the dominitrix's impractical armor requirement. Classes
// like the black knight could even have invulnurable armor that can't be exposed by normal means.

AbilityDictionary.register('crab-claw', {
  type: 'attack',
  stories: [
    { attempt: `The Mudcrab attacks {{T::firstName}} with it's claws `,
      hit: `pinching {{T::his}} {{attack-slot-word}} painfully.`,
      miss: `but misses.` },

    { when: ['attack-head'],
      bonusDamage: 2,
      attempt: `The Mudcrab slashes at {{T::firstName's}} with its claw `,
      hit: ` cutting a deep wound across {{T::his}} face.`,
      miss: ` but misses.` },

    { when: ['attack-chest','target-has-tits'],
      chance: 10,
      bonusDamage: 2,
      hit: `The Mudcrab grabs onto both of {{T::firstName's}} breasts and pinches down hard.`,
      miss: `The Mudcrab tries to grab both of {{T::firstName's}} breasts in its claws but misses.` },

    { when: ['attack-legs','target-not-male'],
      chance: 50,
      hit:`The Mudcrab pinches {{T::firstName's}} rounded ass painfully hard.`,
      miss: `The Mudcrab tries to pinch at {{T::firstName's}} legs but misses.` },

    { when: ['attack-legs','target-cock-exposed'],
      chance: 5,
      bonusDamage: 4,
      hit:`The Mudcrab somehow manages to grab onto {{T::firstName's}} balls and pinches down hard.`,
      miss: `The Mudcrab tries to pinch at {{T::firstName's}} legs but misses.` },
  ],
});

AbilityDictionary.register('crab-grab-legs', {
  type: 'attack',
  cooldown: 5,
  targetSlot: 'legs',

  setCondition: { on:'self', condition:'holding-legs', when:'success' },
  addStatus: { on:'target', status:'bound-legs', when:'success' },
  stories: [
    { attempt:`The Mudcrab lunges for {{T::firstName}} and manages to grab onto both of {{T::his}} legs, `,
      hit:`holding them tightly in its claws.`,
      miss:`but luckily {{T::he}}'s able to pull free.` }
  ],
});

AbilityDictionary.register('crab-grab-arms', {
  type: 'attack',
  cooldown: 5,
  targetSlot: 'hands',

  setCondition: { on:'self', condition:'holding-arms', when:'success' },
  addStatus: { on:'target', status:'bound-arms', when:'success' },
  stories: [
    { attempt:`The Mudcrab lunges for {{T::firstName}} and manages to grab onto both of {{T::his}} wrists, `,
      hit:`holding them tightly in its claws.`,
      miss:`but luckily {{T::he}}'s able to pull free.` }
  ],
});

AbilityDictionary.register('crab-leg-crush', {
  type: 'hold',
  requires: ['monster.condition=holding-legs'],
  stories: [
    { text:`The Mudcrab squeezes {{T::firstName's}} ankles, crushing them painfully in its claws.` }
  ],
});

AbilityDictionary.register('crab-arm-crush', {
  type: 'hold',
  requires: ['monster.condition=holding-arms'],
  stories: [
    { text:`The Mudcrab squeezes {{T::firstName's}} wrists, crushing them painfully in its claws.` }
  ],
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
//           '{{T::firstName's}} panties have been shredded, leaving {{T::him}} completely exposed!'
//           'A wide hole has been torn through {{T::firstName's}} leather pants, letting his cock dangling in front of him!'
//
//       This also tests if the character is wearing cloth or leather, not allowing metal to be torn through.

  // attackStoryPrefix: `With {{T::firstName's}} arms and legs being held by other crabs, {{T::he}}'s unable to defend
  //   {{T::him}}self as the Mudcrab `,
  // attackStories: [
  //   { when:['target-is-legs','target-covered-by-cloth'], effect:'expose-crotch',
  //     text:`claws and rips at the cloth between {{T::hisLegs}}. {{T::equipment.CharactersPantsHaveBeenDestroyed!}} ` },
  //   { when:['target-is-legs','target-covered-by-leather'], effect:'expose-crotch',
  //     text:`claws and rips at the leather between {{T::hisLegs}}. {{T::equipment.CharactersPantsHaveBeenDestroyed!}} ` },
  //   { when:['target-is-legs','target-not-exposed','target-not-covered-by-cloth-or-leather'],
  //     text:`brutally pinches at the gaps in {{T::his}} leg armor. It tries to rip {{T::firstName's}} armor off but
  //           isn't able to claw through the metal.` },

  //   { when:['target-is-legs','target-exposed'],
  //     text:`brutalizes {{T::his}} ass, beating and pinching at {{T::his}} firm ass cheaks with its sharp claws.` },
  //   { when:['target-is-legs','target-exposed','target-has-cock'], chance:25, bonusDamage:4,
  //     text:`brutalizes {{T::his}} cock, grabbing and pulling at the {{P::cock.sixInch}} long shaft in an attempt to rip
  //           {{T::his}} dick off with one of its claw while the other attempts to completely crush his balls. ` },
  //   { when:['target-is-legs','target-exposed','target-has-pussy'], chance:25, bonusDamage:4,
  //     text:`brutally attacks {{T::his}} pussy, pinching and pulling {{T::his}} pussy lips.` },
