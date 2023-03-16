
const BashStories = [
  { attempt:`{{A::Name}} swings {{A::his}} {{A::weapon.main-hand.name}} in a wide arc at {{T::name}}.` },
  { attempt:`{{A::Name}} swings at {{T::name}} with {{A::his}} {{A::weapon.main-hand.name}}.` },

  { requires:['attack.hits-head'],
    attempt:`{{A::Name}} swings {{A::his}} {{A::weapon.main-hand.name}} directly at {{T::name's}} head.` },

  { requires:['attack.hits-legs'],
    attempt:`{{A::Name}} swings {{A::his}} {{A::weapon.main-hand.name}} low, aiming for {{T::name's}} legs.` },

  { requires:['attack.hits-legs','target.exposed-cock'],
    bonusDamage:2,
    attempt:`{{A::Name}} swings {{A::his}} {{A::weapon.main-hand.name}} low, aiming directly for {{T::name's}} {{T::bigBalls}}.` },

  { requires:['attack.hits-legs','target.exposed-pussy'],
    bonusDamage:2,
    attempt:`{{A::Name}} swings {{A::his}} {{A::weapon.main-hand.name}} low and up between {{T::name's}} legs,
             trying to bash {{A::his}} weapon right into {{T::his}} {{pussy}}.` },

  { requires:['attack.hits-chest','target.exposed-tits'],
    bonusDamage:1,
    attempt:`{{A::Name}} tries to bash {{A::his}} {{A::weapon.main-hand.name}} into {{T::name's}} {{T::bigTits}}.` },
]

const ShootStories = [
  { attempt:`{{A::Name}} shoots {{A::his}} {{A::weapon.main-hand.name}} at {{T::name}}.` },
  { attempt:`{{A::Name}} shoots at {{T::name}} with {{A::his}} {{A::weapon.main-hand.name}}.` },

  { requires:['attack.hits-head'],
    bonusDamage:2,
    attempt:`{{A::Name}} takes careful aim, shooting {{A::his}} {{A::weapon.main-hand.name}} directly at {{T::name's}} head.` },

  { requires:['attack.hits-legs'],
    attempt:`{{A::Name}} aims low, shooting {{A::his}} {{A::weapon.main-hand.name}} at {{T::name's}} legs.` },

  { requires:['attack.hits-legs','target.exposed-cock'],
    bonusDamage:2,
    attempt:`{{A::Name}} shoots low, aiming {{A::his}} {{A::weapon.main-hand.name}} directly at {{T::name's}} {{T::bigBalls}}.` },

  { requires:['attack.hits-chest','target.exposed-tits'],
    bonusDamage:1,
    attempt:`{{A::Name}} shoots {{A::his}} {{A::weapon.main-hand.name}} at {{T::name}}.`,
    hit:`Hit! The shot hits {{T::him}} right in one of {{T::his}} {{T::bigTits}}.` },
]

const SlashStories = [
  { attempt:`{{A::Name}} slashes at {{T::name}} with {{A::his}} {{A::weapon.main-hand.name}}.` },
  { attempt:`{{A::Name}} swings {{A::his}} {{A::weapon.main-hand.name}} at {{T::name}}.` },

  { requires:['attack.hits-head'],
    bonusDamage:2,
    attempt:`{{A::Name}} swings high, slashing {{A::his}} {{A::weapon.main-hand.name}} into {{T::name's}} face.` },

  { requires:['attack.hits-legs'],
    attempt:`{{A::Name}} swings low, slashing {{A::his}} {{A::weapon.main-hand.name}} at {{T::name's}} legs.` },

  { requires:['attack.hits-legs','target.exposed-cock'],
    bonusDamage:2,
    attempt:`{{A::Name}} swings low, slashing {{A::his}} {{A::weapon.main-hand.name}} directly at {{T::name's}} {{T::bigBalls}}.` },

  { requires:['attack.hits-chest','target.exposed-tits'],
    bonusDamage:1,
    attempt:`{{A::Name}} slashes at {{T::name's}} {{T::bigTits}} with {{A::his}} {{A::weapon.main-hand.name}}.` },

]

const ThrustStories = [
  { attempt:`{{A::Name}} thrusts {{A::his}} {{A::weapon.main-hand.name}} at {{T::name}}.` },
  { attempt:`{{A::Name}} lunges at {{T::name}} with {{A::his}} {{A::weapon.main-hand.name}}.` },
  { attempt:`{{A::Name}} stabs at {{T::name}} with {{A::his}} {{A::weapon.main-hand.name}}.` },

  { requires:['attack.hits-head'],
    bonusDamage:2,
    attempt:`{{A::Name}} tries to stab {{T::name}} in the face with {{A::his}} {{A::weapon.main-hand.name}}.` },

  { requires:['attack.hits-chest','target.exposed-tits'],
    bonusDamage:1,
    attempt:`{{A::Name}} lunches at {{T::name}} with {{A::his}} {{A::weapon.main-hand.name}}, attempting to stab at
             {{T::his}} exposed {{tits}}.` },
]

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
    }
    catch(error) {
      console.error(`[Story Teller Error : ${error}]`);
      console.error(this.#result.pack());
      console.trace();

      return { text:`[Story Teller Error: ${error}]` };
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
