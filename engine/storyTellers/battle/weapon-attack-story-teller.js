
const BashStories = [
  new Story({ tryText: `{{A::Name}} swings {{A::his}} {{A::weapon.main-hand.name}} in a wide arc at {{T::name}}.` }),
  new Story({ tryText: `{{A::Name}} swings at {{T::name}} with {{A::his}} {{A::weapon.main-hand.name}}.` }),
];

const ShootStories = [
  new Story({ tryText:`{{A::Name}} shoots {{A::his}} {{A::weapon.main-hand.name}} at {{T::name}}.` }),
  new Story({ tryText:`{{A::Name}} shoots at {{T::name}} with {{A::his}} {{A::weapon.main-hand.name}}.` }),
];

const SlashStories = [
  new Story({ tryText:`{{A::Name}} swings {{A::his}} {{A::weapon.main-hand.name}} at {{T::name}}.` }),
  new Story({ tryText:`{{A::Name}} slashes at {{T::name}} with {{A::his}} {{A::weapon.main-hand.name}}.` }),
];

const ThrustStories = [
  new Story({ tryText:`{{A::Name}} thrusts {{A::his}} {{A::weapon.main-hand.name}} at {{T::name}}.` }),
  new Story({ tryText:`{{A::Name}} lunges at {{T::name}} with {{A::his}} {{A::weapon.main-hand.name}}.` }),
  new Story({ tryText:`{{A::Name}} stabs at {{T::name}} with {{A::his}} {{A::weapon.main-hand.name}}.` }),
];

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
