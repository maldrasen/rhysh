
global.WeaponAttackStoryTeller = (function() {

  const BashStories = [
    new BattleStory({ actionText: `{{A::Name}} swings {{A::his}} {{A::weapon.main-hand.name}} at {{T::name}}.` }),
    new BattleStory({ actionText: `{{A::Name}} swings at {{T::name}} with {{A::his}} {{A::weapon.main-hand.name}}.` }),
  ];

  const ShootStories = [
    new BattleStory({ actionText:`{{A::Name}} shoots {{A::his}} {{A::weapon.main-hand.name}} at {{T::name}}.` }),
    new BattleStory({ actionText:`{{A::Name}} shoots at {{T::name}} with {{A::his}} {{A::weapon.main-hand.name}}.` }),
  ];

  const SlashStories = [
    new BattleStory({ actionText:`{{A::Name}} swings {{A::his}} {{A::weapon.main-hand.name}} at {{T::name}}.` }),
    new BattleStory({ actionText:`{{A::Name}} slashes at {{T::name}} with {{A::his}} {{A::weapon.main-hand.name}}.` }),
  ];

  const ThrustStories = [
    new BattleStory({ actionText:`{{A::Name}} thrusts {{A::his}} {{A::weapon.main-hand.name}} at {{T::name}}.` }),
    new BattleStory({ actionText:`{{A::Name}} lunges at {{T::name}} with {{A::his}} {{A::weapon.main-hand.name}}.` }),
    new BattleStory({ actionText:`{{A::Name}} stabs at {{T::name}} with {{A::his}} {{A::weapon.main-hand.name}}.` }),
  ];

  // Get an action story given a weapon mode and the context. The weapon object
  // is optional, and isn't currently used for anything. We may someday have
  // more interesting stories for special weapons at some point though which
  // will probably be saved on the weapon itself. A bit up in the air still,
  // but as we should have easy access to the weapon might as well include it.
  //
  // Options:
  //   mode: weapon mode
  //   weapon: weapon object
  //
  function tellActionStory(options) {
    const scrutinizer = new Scrutinizer(options.context);

    const storyList = {
      bash: BashStories,
      shoot: ShootStories,
      slash: SlashStories,
      thrust: ThrustStories,
    }[options.mode];

    const validStories = ArrayHelper.compact(storyList.map(story => {
      return scrutinizer.meetsRequirements(story.requires) ? story : null;
    }));

    return Weaver.weave(Random.from(validStories).actionText, options.context);
  }

  return { tellActionStory }

})();
