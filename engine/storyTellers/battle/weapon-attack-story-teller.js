
const BashStories = [
  { attempt:`{{A::name}} swings {{A::his}} {{A::weapon.main-hand.name}} in a wide arc at {{T::name}}.` }
]

const ShootStories = [
  { attempt:`{{A::name}} shoots {{A::his}} {{A::weapon.main-hand.name}} at {{T::name}}.` }
]

const SlashStories = [
  { attempt:`{{A::name}} slashes at {{T::name}} with {{A::his}} {{A::weapon.main-hand.name}}.` }
]

const ThrustStories = [
  { attempt:`{{A::name}} thrusts {{A::his}} {{A::weapon.main-hand.name}} at {{T::name}}.` },
  { attempt:`{{A::name}} lunges at {{T::name}} with {{A::his}} {{A::weapon.main-hand.name}}.` },
]

  //   { attempt: `{{A::Name}} charges at {{T::name}} swingingly {{A::his}} {{A::weapon.main-hand.name}} wildly.`,
  //     hit: `{{A::His}} desprate attack scores a deep hit on {{T::name's}} {{battle|target-slot-word}}, but leaves
  //           {{A::him}} sprawled out on the ground.`,
  //     miss: `{{A::He}} misses badly, falling flat on {{A::his}} face.` },
  // ]

    // { attempt: `The Mudcrab attacks {{T::name}} with its claws.`,
    //   hit: `It pinches {{T::his}} {{battle|target-slot-word}} painfully.` },
    // { attempt: `The Mudcrab attacks {{T::name}} with its claws.`,
    //   hit: `Its sharp claw draws a deep scratch across {{T::his}} {{battle|target-slot-word}}.` },
    // { when: ['attack.hits-head'],
    //   bonusDamage: 2,
    //   attempt: `The Mudcrab slashes at {{T::name}} with its claws.`,
    //   hit: `Its sharp claw cuts a deep wound across {{T::his}} face.` },
    // { when: ['attack.hits-chest','target.has-tits'],
    //   chance: 10,
    //   bonusDamage: 2,
    //   attempt: `The Mudcrab slashes at {{T::name's}} breasts with its claws.`,
    //   hit: `The Mudcrab grabs onto both of {{T::his}} breasts and pinches down hard, leaving dark bruises on {{T::his}}
    //         tits.` },
    // { when: ['attack.hits-legs','target.not-male'],
    //   chance: 50,
    //   attempt: `The Mudcrab slashes at {{T::name's}} legs with its claws.`,
    //   hit:`The Mudcrab pinches {{T::his}} rounded ass painfully hard.` },
    // { when: ['attack.hits-legs','target.cock-exposed'],
    //   chance: 10,
    //   bonusDamage: 4,
    //   attempt: `The Mudcrab slashes at {{T::name's}} legs with its claws.`,
    //   hit:`The Mudcrab somehow manages to grab onto {{T::name's}} dangling ballsack and pinches down hard, almost
    //         crushing one of {{T::his}} balls.` },





global.WeaponAttackStoryTeller = class WeaponAttackStoryTeller {

  #result
  #scrutinizer;

  constructor(result) {
    this.#result = result;
    this.#scrutinizer = result.getScrutinizer();
  }

  tellStory() {
    try {
      return {
        bash: () =>   { return this.tellBashStory() },
        shoot: () =>  { return this.tellShootStory() },
        slash: () =>  { return this.tellSlashStory() },
        thrust: () => { return this.tellThrustStory() },
      }[this.#result.getWeaponMode()]();
    } catch(error) {
      return `[Story Teller Error : ${error}]`
    }
  }

  tellBashStory() {
    return Random.from(ArrayHelper.compact(BashStories.map(story => {
      return this.#scrutinizer.meetsRequirements(story.requires) ? story : null;
    })));
  }

  tellShootStory() {
    return Random.from(ArrayHelper.compact(ShootStories.map(story => {
      return this.#scrutinizer.meetsRequirements(story.requires) ? story : null;
    })));
  }

  tellSlashStory() {
    return Random.from(ArrayHelper.compact(SlashStories.map(story => {
      return this.#scrutinizer.meetsRequirements(story.requires) ? story : null;
    })));
  }

  tellThrustStory() {
    return Random.from(ArrayHelper.compact(ThrustStories.map(story => {
      return this.#scrutinizer.meetsRequirements(story.requires) ? story : null;
    })));
  }

}
