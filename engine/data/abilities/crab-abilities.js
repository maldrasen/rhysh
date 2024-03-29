
const cockClaw = new Ability('crab-cock-claw',{
  type: _attack,
  targetSlot: _legs,
  uses:[_hands],
  requires:['target.exposed-cock'],
  hitBonus: -2,
  damage:{ d:4, p:4 },
  cooldown: 5,
});
cockClaw.addActionStory({ text:`{{A::Name}} snaps at {{T::name's}} crotch with its claws.` });
cockClaw.addSuccessStory({ text: `{{A::He}} somehow manages to grab onto {{T::name's}} dangling ballsack and
  pinches down hard, almost crushing one of {{T::his}} balls.` });
cockClaw.addSuccessStory({ text: `{{A::He}} grabs onto {{T::name's}} exposed cock and pinches down hard, crushing
  {{T::his}} {{T::bigCock}} in its sharp claws.` });


const titClaw = new Ability('crab-tit-claw',{
  type: _attack,
  targetSlot: _chest,
  uses:[_hands],
  requires:['target.exposed-tits'],
  hitBonus: -2,
  damage:{ d:4, p:4 },
  cooldown: 5,
});
titClaw.addActionStory({ text:`{{A::Name}} snaps at {{T::name's}} {{T::bigTits}} with its claws.` })
titClaw.addSuccessStory({ text:`{{A::His}} claws dig into {{T::his}} {{T::tits}}, pinching them painfully.` });
titClaw.addSuccessStory({ text:`{{A::He}} grabs onto both of {{T::his}} breasts and pinches down hard, leaving
  dark bruises on both of {{T::his}} tits.` });


const grabLegs = new Ability('crab-grab-legs',{
  type: _attack,
  targetSlot: _legs,
  uses:[_hands],
  hitBonus: -2,
  cooldown: 5,
  setCondition: { on:_self, condition:_holdingLegs, when:_success },
  addStatus: { on:_single, status:_boundLegs, when:_success },
});
grabLegs.addActionStory({ text:`{{A::Name}} lunges for {{T::name's}} legs.` });
grabLegs.addSuccessStory({ text:`{{A::He}} grabs on to both of {{T::his}} legs holding them tightly in
  {{A::his}} claws.` });


const grabArms = new Ability('crab-grab-arms',{
  type: _attack,
  targetSlot: _hands,
  uses:[_hands],
  hitBonus: -2,
  cooldown: 5,
  setCondition: { on:_self, condition:_holdingArms, when:_success },
  addStatus: { on:_single, status:_boundArms, when:_success },
});
grabArms.addActionStory({ text:`{{A::Name}} lunges for {{T::name's}} arms.` });
grabArms.addSuccessStory({ text:`{{A::He}} grabs on to both of {{T::his}} wrists holding them tightly in
  {{A::his}} claws.` });


const legCrush = new Ability('crab-leg-crush',{
  type: _hold,
  uses:[_hands],
  requires: ['monster.condition=holdingLegs'],
  damage:{ d:4, p:2 },
});
legCrush.addActionStory({ text:`{{A::Name}} squeezes {{T::name's}} ankles, crushing them painfully in
  {{A::his}} sharp claws.` });


const armCrush = new Ability('crab-arm-crush',{
  type: _hold,
  uses:[_hands],
  requires: ['monster.condition=holdingArms'],
  damage:{ d:4, p:2 },
});
armCrush.addActionStory({ text:`{{A::Name}} squeezes {{T::name's}} wrists, crushing them painfully in
  {{A::his}} sharp claws.` });


const brutalize = new Ability('crab-brutalize',{
  type: _coupDeGrace,
  uses:[_hands],
  requires: ['target.status=boundArms','target.status=boundLegs'],
  damage: { d:4, p:8 },
  storyTeller: 'MudcrabBrutalizer'
});


Ability.register(cockClaw);
Ability.register(titClaw);
Ability.register(grabLegs);
Ability.register(grabArms);
Ability.register(legCrush);
Ability.register(armCrush);
Ability.register(brutalize);






// // TODO: Actually... this is one ability is complicated enough to need a separate story teller class, it has complex
// //       branching logic that depends on what the person is wearing, it changes the state of their equipment, and all
// //       kinds of shit. For now, we can just add a todo story and do damage.
// //
// // TODO: This could get rather complicated as we need to describe the character's crotch getting exposed, but that
// //       could be different for each piece of equipment. I think we need to require each armor type to include a
// //       description of it getting destroyed that attacks like this can tap into. Something like:
// //
// //           '{{T::name's}} panties have been shredded, leaving {{T::him}} completely exposed!'
// //           'A wide hole has been torn through {{T::name's}} leather pants, letting his cock dangling in front of him!'
// //
// //       This also tests if the character is wearing cloth or leather, not allowing metal to be torn through.

//   // attackStoryPrefix: `With {{T::name's}} arms and legs being held by other crabs, {{T::he}}'s unable to defend
//   //   {{T::him}}self as the Mudcrab `,
//   // attackStories: [
//   //   { when:['target-is-legs','target-covered-by-cloth'], effect:'expose-crotch',
//   //     text:`claws and rips at the cloth between {{T::hisLegs}}. {{T::equipment.CharactersPantsHaveBeenDestroyed!}} ` },
//   //   { when:['target-is-legs','target-covered-by-leather'], effect:'expose-crotch',
//   //     text:`claws and rips at the leather between {{T::hisLegs}}. {{T::equipment.CharactersPantsHaveBeenDestroyed!}} ` },
//   //   { when:['target-is-legs','target-not-exposed','target-not-covered-by-cloth-or-leather'],
//   //     text:`brutally pinches at the gaps in {{T::his}} leg armor. It tries to rip {{T::name's}} armor off but
//   //           isn't able to claw through the metal.` },

//   //   { when:['target-is-legs','target-exposed'],
//   //     text:`brutalizes {{T::his}} ass, beating and pinching at {{T::his}} firm ass cheaks with its sharp claws.` },
//   //   { when:['target-is-legs','target-exposed','target-has-cock'], chance:25, bonusDamage:4,
//   //     text:`brutalizes {{T::his}} cock, grabbing and pulling at the {{P::cock.sixInch}} long shaft in an attempt to rip
//   //           {{T::his}} dick off with one of its claw while the other attempts to completely crush his balls. ` },
//   //   { when:['target-is-legs','target-exposed','target-has-pussy'], chance:25, bonusDamage:4,
//   //     text:`brutally attacks {{T::his}} pussy, pinching and pulling {{T::his}} pussy lips.` },
